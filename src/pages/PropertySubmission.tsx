import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './PropertySubmission.module.css';
import { createProperty, updateProperty, getProperty, PropertySubmissionData } from '../api/propertyService';

interface FormErrors {
  [key: string]: string;
}

interface PropertyFormData {
  name: string;
  description: string;
  city: string;
  parish: string;
  type: 'villa' | 'apartment' | 'cottage' | 'beach house';
  pricePerNight: string;
  currency: 'JMD' | 'USD';
  amenities: string[];
  images: File[];
}

const JAMAICAN_PARISHES = [
  'Kingston',
  'St. Andrew',
  'St. Catherine',
  'Clarendon',
  'Manchester',
  'St. Elizabeth',
  'Westmoreland',
  'Hanover',
  'St. James',
  'Trelawny',
  'St. Ann',
  'St. Mary',
  'Portland',
  'St. Thomas',
];

const PROPERTY_TYPES = [
  { value: 'villa', label: 'Villa' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'cottage', label: 'Cottage' },
  { value: 'beach house', label: 'Beach House' },
];

const AMENITIES = [
  'WiFi',
  'Pool',
  'Beach Access',
  'Air Conditioning',
  'Kitchen',
  'Parking',
  'Hot Water',
  'Security',
  'Ocean View',
  'Mountain View',
];

export const PropertySubmission: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<PropertyFormData>({
    name: '',
    description: '',
    city: '',
    parish: JAMAICAN_PARISHES[0],
    type: 'villa',
    pricePerNight: '',
    currency: 'USD',
    amenities: [],
    images: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [attemptedNext, setAttemptedNext] = useState(false);

  useEffect(() => {
    const loadProperty = async () => {
      if (id) {
        try {
          setIsLoading(true);
          const property = await getProperty(id);
          setFormData({
            name: property.name,
            description: '', // Add description field to Property model
            city: property.location.city,
            parish: property.location.parish,
            type: property.type,
            pricePerNight: property.pricePerNight.toString(),
            currency: property.currency,
            amenities: property.amenities,
            images: [], // Can't load File objects from server
          });
        } catch (error) {
          console.error('Error loading property:', error);
          setErrors({ submit: 'Failed to load property details.' });
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadProperty();
  }, [id]);

  // SPIN Selling Steps
  const steps = [
    {
      title: 'Situation',
      description: 'Tell us about your property',
      fields: ['name', 'description', 'city', 'parish', 'type'],
    },
    {
      title: 'Problem',
      description: 'What challenges do travelers face finding accommodations in your area?',
      fields: ['pricePerNight', 'currency'],
    },
    {
      title: 'Implication',
      description: 'How can your property help solve these challenges?',
      fields: ['amenities'],
    },
    {
      title: 'Need-Payoff',
      description: 'Show how your property stands out',
      fields: ['images'],
    },
  ];

  const validateField = (field: string): string => {
    switch (field) {
      case 'name':
        return !formData.name.trim() ? 'Property name is required' : '';
      case 'description':
        return !formData.description.trim() ? 'Description is required' : '';
      case 'city':
        return !formData.city.trim() ? 'City is required' : '';
      case 'parish':
        return !JAMAICAN_PARISHES.includes(formData.parish) ? 'Valid parish is required' : '';
      case 'type':
        return !formData.type ? 'Property type is required' : '';
      case 'pricePerNight':
        return !formData.pricePerNight || Number(formData.pricePerNight) <= 0
          ? 'Valid price is required'
          : '';
      case 'images':
        return !isEditMode && formData.images.length === 0 ? 'At least one image is required' : '';
      default:
        return '';
    }
  };

  const validateStep = (stepIndex: number): boolean => {
    const step = steps[stepIndex];
    const newErrors: FormErrors = {};

    step.fields.forEach((field) => {
      const error = validateField(field);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (attemptedNext) {
      const error = validateField(name);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
      if (attemptedNext) {
        setErrors((prev) => ({
          ...prev,
          images: validateField('images'),
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAttemptedNext(true);
    
    // Validate all steps before submission
    let isValid = true;
    for (let i = 0; i < steps.length; i++) {
      if (!validateStep(i)) {
        setCurrentStep(i);
        isValid = false;
        break;
      }
    }

    if (!isValid) return;

    try {
      setIsLoading(true);
      const propertyData: PropertySubmissionData = {
        name: formData.name,
        description: formData.description,
        location: {
          city: formData.city,
          parish: formData.parish,
          coordinates: {
            // TODO: Implement geocoding service to get coordinates from city/parish
            lat: 18.0179,
            lng: -76.8099,
          },
        },
        type: formData.type,
        pricePerNight: Number(formData.pricePerNight),
        currency: formData.currency,
        amenities: formData.amenities,
        images: formData.images,
      };

      if (isEditMode && id) {
        await updateProperty(id, propertyData);
      } else {
        await createProperty(propertyData);
      }

      navigate('/host');
    } catch (error) {
      console.error('Error submitting property:', error);
      setErrors((prev) => ({
        ...prev,
        submit: 'Failed to submit property. Please try again.',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    setAttemptedNext(true);
    if (validateStep(currentStep) && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setAttemptedNext(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setAttemptedNext(false);
    }
  };

  const getInputClasses = (fieldName: string) => 
    `${styles.input} ${errors[fieldName] ? styles.error : ''}`;

  const renderStepContent = () => {
    const step = steps[currentStep];

    return (
      <div className={styles.stepContent}>
        <h2>{step.title}</h2>
        <p>{step.description}</p>

        {step.fields.includes('name') && (
          <div className={styles.formGroup}>
            <label htmlFor="name">Property Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={getInputClasses('name')}
              placeholder="e.g., Beachfront Villa in Montego Bay"
            />
            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
          </div>
        )}

        {step.fields.includes('description') && (
          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={getInputClasses('description')}
              placeholder="Describe your property features, location, and unique selling points..."
              rows={4}
            />
            {errors.description && <span className={styles.errorText}>{errors.description}</span>}
          </div>
        )}

        {step.fields.includes('city') && (
          <div className={styles.formGroup}>
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className={getInputClasses('city')}
              placeholder="e.g., Montego Bay"
            />
            {errors.city && <span className={styles.errorText}>{errors.city}</span>}
          </div>
        )}

        {step.fields.includes('parish') && (
          <div className={styles.formGroup}>
            <label htmlFor="parish">Parish</label>
            <select
              id="parish"
              name="parish"
              value={formData.parish}
              onChange={handleInputChange}
              className={getInputClasses('parish')}
            >
              {JAMAICAN_PARISHES.map((parish) => (
                <option key={parish} value={parish}>
                  {parish}
                </option>
              ))}
            </select>
            {errors.parish && <span className={styles.errorText}>{errors.parish}</span>}
          </div>
        )}

        {step.fields.includes('type') && (
          <div className={styles.formGroup}>
            <label htmlFor="type">Property Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className={getInputClasses('type')}
            >
              {PROPERTY_TYPES.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {errors.type && <span className={styles.errorText}>{errors.type}</span>}
          </div>
        )}

        {step.fields.includes('pricePerNight') && (
          <div className={styles.formGroup}>
            <label htmlFor="pricePerNight">Price per Night</label>
            <div className={styles.priceGroup}>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className={`${getInputClasses('currency')} ${styles.currencySelect}`}
              >
                <option value="USD">USD</option>
                <option value="JMD">JMD</option>
              </select>
              <input
                type="number"
                id="pricePerNight"
                name="pricePerNight"
                value={formData.pricePerNight}
                onChange={handleInputChange}
                className={`${getInputClasses('pricePerNight')} ${styles.priceInput}`}
                min="0"
                step="0.01"
                placeholder="Enter price"
              />
            </div>
            {errors.pricePerNight && (
              <span className={styles.errorText}>{errors.pricePerNight}</span>
            )}
          </div>
        )}

        {step.fields.includes('amenities') && (
          <div className={styles.formGroup}>
            <label>Amenities</label>
            <div className={styles.amenitiesGrid}>
              {AMENITIES.map((amenity) => (
                <label key={amenity} className={styles.amenityLabel}>
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                  />
                  {amenity}
                </label>
              ))}
            </div>
          </div>
        )}

        {step.fields.includes('images') && (
          <div className={styles.formGroup}>
            <label htmlFor="images">Property Images</label>
            <input
              type="file"
              id="images"
              name="images"
              onChange={handleImageUpload}
              className={getInputClasses('images')}
              multiple
              accept="image/*"
            />
            {errors.images && <span className={styles.errorText}>{errors.images}</span>}
            <div className={styles.imagePreview}>
              {formData.images.map((image, index) => (
                <div key={index} className={styles.previewImage}>
                  <img src={URL.createObjectURL(image)} alt={`Preview ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1>{isEditMode ? 'Edit Property' : 'Add New Property'}</h1>
      
      <div className={styles.progressBar}>
        {steps.map((step, index) => (
          <div
            key={step.title}
            className={`${styles.progressStep} ${
              currentStep > index ? styles.completed : ''
            } ${currentStep === index ? styles.active : ''}`}
          >
            {step.title}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {renderStepContent()}

        {errors.submit && <div className={styles.submitError}>{errors.submit}</div>}

        <div className={styles.buttonGroup}>
          {currentStep > 0 && (
            <button type="button" onClick={prevStep} className={styles.secondaryButton}>
              Previous
            </button>
          )}
          {currentStep < steps.length - 1 ? (
            <button type="button" onClick={nextStep} className={styles.primaryButton}>
              Next
            </button>
          ) : (
            <button type="submit" className={styles.primaryButton} disabled={isLoading}>
              {isEditMode ? 'Save Changes' : 'Submit Property'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PropertySubmission;
