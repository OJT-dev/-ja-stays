import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          JA Stays
        </Link>
        
        <div className={styles.search}>
          <input 
            type="text" 
            placeholder="Where to in Jamaica?" 
            className={styles.searchInput}
          />
          <button className={styles.searchButton}>
            <span>Search</span>
          </button>
        </div>

        <div className={styles.menu}>
          <Link to="/properties" className={styles.menuItem}>
            Explore
          </Link>
          <Link to="/host" className={styles.menuItem}>
            Become a Host
          </Link>
          <div className={styles.userMenu}>
            <button className={styles.userButton}>
              <span>Menu</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
