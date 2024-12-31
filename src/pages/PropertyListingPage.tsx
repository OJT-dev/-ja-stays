import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PropertyMatcher } from '../services/ai/matching';
import { getProperties } from '../api/propertyService';
import UserPreferencesForm from '../components/UserPreferencesForm';
import styles from './PropertyListingPage.module.css';

export interface Property {
  id: string;
  name: string;
  location: {
    city: string;
    parish: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  type: 'villa' | 'apartment' | 'cottage' | 'beach house';
  amenities: string[];
  pricePerNight: number;
  currency: 'JMD' | 'USD';
  rating?: number;
  reviewsCount?: number;
  host: {
    id: string;
    name: string;
    isSuperhost: boolean;
  };
  images: string[];
  availability: {
    startDate: Date;
    endDate: Date;
  }[];
  matchScore?: number;
}

interface MatchedProperty extends Property {
  matchScore: number;
}

const PropertyListingPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [userPreferences, setUserPreferences] = useState({
    location: 'Montego Bay',
    budget: 200,
    amenities: ['pool', 'wifi'],
    travelDates: [new Date(), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)] as [Date, Date]
  });

  useEffect(() => {
    const fetchAndMatchProperties = async () => {
      try {
        const allProperties = await getProperties();
        const matchedProperties = allProperties
          .map(property => ({
            ...property,
            matchScore: PropertyMatcher.calculateMatchScore(userPreferences, property)
          }))
          .sort((a, b) => b.matchScore - a.matchScore);
        
        setProperties(matchedProperties);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchAndMatchProperties();
  }, [userPreferences]);

  return (
    <div className={styles['property-listing']}>
      <h1>Our Properties</h1>
      <p>Explore our selection of Jamaican vacation rentals</p>
      
      <div className={styles['preferences-section']}>
        <UserPreferencesForm 
          onSubmit={(preferences) => setUserPreferences(preferences)}
        />
      </div>
      
      <div className={styles['property-grid']}>
        {properties.map(property => (
          <div key={property.id} className={styles['property-card']}>
            <div className={styles['property-image']}>
              <img src={property.images[0]} alt={property.name} />
              {property.host.isSuperhost && (
                <div className={styles['superhost-badge']}>Superhost</div>
              )}
            </div>
            <div className={styles['property-details']}>
              <div className={styles['property-header']}>
                <h2>{property.name}</h2>
                <div className={styles['property-rating']}>
                  {property.rating && (
                    <>
                      <span className={styles['star']}>★</span>
                      <span>{property.rating.toFixed(1)}</span>
                      {property.reviewsCount && (
                        <span className={styles['reviews']}>({property.reviewsCount})</span>
                      )}
                    </>
                  )}
                </div>
              </div>
              <p className={styles['property-location']}>
                {property.location.city}, {property.location.parish}
              </p>
              <p className={styles['property-type']}>
                {property.type.replace(/_/g, ' ')}
              </p>
              <div className={styles['property-price']}>
                <span className={styles['price']}>
                  {property.pricePerNight} {property.currency}
                </span>
                <span className={styles['per-night']}>/ night</span>
              </div>
              {property.matchScore && (
                <div className={styles['match-score']}>
                  Match: {(property.matchScore * 100).toFixed(0)}%
                </div>
              )}
              <Link 
                to={`/properties/${property.id}`} 
                className={styles['view-details']}
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyListingPage;
