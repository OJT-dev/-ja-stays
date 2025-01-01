import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HostDashboard.module.css';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  bookings: number;
  rating: number;
  status: 'active' | 'pending' | 'inactive';
}

interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  occupancyRate: number;
}

export const HostDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  const [stats] = useState<DashboardStats>({
    totalBookings: 0,
    totalRevenue: 0,
    averageRating: 0,
    occupancyRate: 0,
  });

  const [properties] = useState<Property[]>([]);

  const handleAddProperty = () => {
    navigate('/host/properties/new');
  };

  const handleEditProperty = (propertyId: string) => {
    navigate(`/host/properties/${propertyId}/edit`);
  };

  const handleManageBookings = (propertyId: string) => {
    navigate(`/host/properties/${propertyId}/bookings`);
  };

  const handleViewAnalytics = (propertyId: string) => {
    navigate(`/host/properties/${propertyId}/analytics`);
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Host Dashboard</h1>
        <button className={styles.addPropertyBtn} onClick={handleAddProperty}>
          Add New Property
        </button>
      </header>

      <section className={styles.stats}>
        <div className={styles.statCard}>
          <h3>Total Bookings</h3>
          <p>{stats.totalBookings}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Total Revenue</h3>
          <p>${stats.totalRevenue.toLocaleString()}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Average Rating</h3>
          <p>{stats.averageRating.toFixed(1)} / 5.0</p>
        </div>
        <div className={styles.statCard}>
          <h3>Occupancy Rate</h3>
          <p>{stats.occupancyRate}%</p>
        </div>
      </section>

      <section className={styles.properties}>
        <h2>Your Properties</h2>
        {properties.length === 0 ? (
          <div className={styles.emptyState}>
            <p>You haven't added any properties yet.</p>
            <button className={styles.addPropertyBtn} onClick={handleAddProperty}>
              Add Your First Property
            </button>
          </div>
        ) : (
          <div className={styles.propertyList}>
            {properties.map((property) => (
              <div key={property.id} className={styles.propertyCard}>
                <div className={styles.propertyHeader}>
                  <h3>{property.title}</h3>
                  <span className={styles[property.status]}>{property.status}</span>
                </div>
                <div className={styles.propertyDetails}>
                  <p>Location: {property.location}</p>
                  <p>Price: ${property.price}/night</p>
                  <p>Bookings: {property.bookings}</p>
                  <p>Rating: {property.rating.toFixed(1)}/5.0</p>
                </div>
                <div className={styles.propertyActions}>
                  <button onClick={() => handleEditProperty(property.id)}>Edit</button>
                  <button onClick={() => handleManageBookings(property.id)}>Manage Bookings</button>
                  <button onClick={() => handleViewAnalytics(property.id)}>View Analytics</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HostDashboard;
