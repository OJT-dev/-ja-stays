import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProperty } from '../api/propertyService';
import { Property } from './PropertyListingPage';
import styles from './PropertyDetailPage.module.css';

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        if (id) {
          const propertyData = await getProperty(id);
          setProperty(propertyData);
        }
      } catch (err) {
        setError('Failed to load property details');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!property) return <div>Property not found</div>;

  return (
    <div className={styles.container}>
      <div className={styles.imageGallery}>
        {property.images.map((image, index) => (
          <img 
            key={index} 
            src={image} 
            alt={`Property ${index + 1}`} 
            className={styles.propertyImage}
          />
        ))}
      </div>

      <div className={styles.detailsSection}>
        <h1 className={styles.title}>{property.name}</h1>
        <div className={styles.location}>
          {property.location.city}, {property.location.parish}
        </div>

        <div className={styles.hostInfo}>
          <h2>Hosted by {property.host.name}</h2>
          {property.host.isSuperhost && (
            <div className={styles.superhostBadge}>Superhost</div>
          )}
        </div>

        <div className={styles.amenities}>
          <h3>Amenities</h3>
          <ul>
            {property.amenities.map((amenity, index) => (
              <li key={index}>{amenity}</li>
            ))}
          </ul>
        </div>

        <div className={styles.bookingSection}>
          <h2>${property.pricePerNight} {property.currency} / night</h2>
          <Link 
            to={`/bookings?propertyId=${property.id}`}
            className={styles.bookButton}
          >
            Book Now
          </Link>
        </div>

        {property.rating && (
          <div className={styles.rating}>
            ★ {property.rating.toFixed(1)} ({property.reviewsCount} reviews)
          </div>
        )}

        <div className={styles.description}>
          <h3>About this property</h3>
          <p>
            Experience the best of Jamaican hospitality in this beautiful {property.type}.
            Located in the heart of {property.location.city}, this property offers
            everything you need for a perfect vacation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;
