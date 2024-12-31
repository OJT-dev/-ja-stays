import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';

const popularDestinations = [
  {
    name: 'Montego Bay',
    image: '/images/montego-bay-villa.jpg',
    description: 'Experience the vibrant culture and beautiful beaches'
  },
  {
    name: 'Kingston',
    image: '/images/kingston-apartment.jpg',
    description: 'Explore Jamaica\'s capital city'
  },
  {
    name: 'Negril',
    image: '/images/negril-beach-house.jpg',
    description: 'Relax at the famous Seven Mile Beach'
  }
];

const HomePage: React.FC = () => {
  return (
    <div className={styles.container}>
      <section 
        className={styles.hero} 
        style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/images/jamaica-hero.jpg')` }}
      >
        <div className={styles.heroContent}>
          <h1>Welcome to JA Stays</h1>
          <p>Discover your perfect Jamaican getaway</p>
          <Link to="/properties" className={styles.exploreButton}>
            Explore Properties
          </Link>
        </div>
      </section>

      <section className={styles.destinations}>
        <div className={styles.sectionContainer}>
          <h2>Popular Destinations</h2>
          <div className={styles.destinationGrid}>
            {popularDestinations.map((destination) => (
              <Link 
                to={`/properties?location=${encodeURIComponent(destination.name)}`} 
                key={destination.name}
                className={styles.destinationCard}
              >
                <div className={styles.destinationImage}>
                  <img src={destination.image} alt={destination.name} loading="lazy" />
                </div>
                <div className={styles.destinationInfo}>
                  <h3>{destination.name}</h3>
                  <p>{destination.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.sectionContainer}>
          <h2>Why Choose JA Stays?</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <h3>Authentic Experiences</h3>
              <p>Immerse yourself in true Jamaican culture with our carefully selected properties</p>
            </div>
            <div className={styles.featureCard}>
              <h3>Best Prices</h3>
              <p>Find the perfect stay that matches your budget with our dynamic pricing</p>
            </div>
            <div className={styles.featureCard}>
              <h3>Local Expertise</h3>
              <p>Get insider tips and recommendations from our local hosts</p>
            </div>
          </div>
        </div>
      </section>

      <section 
        className={styles.cta}
        style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/images/jamaica-hero.jpg')` }}
      >
        <div className={styles.sectionContainer}>
          <h2>Ready to start your Jamaican adventure?</h2>
          <Link to="/properties" className={styles.ctaButton}>
            Find Your Perfect Stay
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
