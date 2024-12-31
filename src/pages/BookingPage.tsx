import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './BookingPage.module.css';
import { createBooking } from '../api/propertyService';

interface BookingForm {
  propertyId: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  paymentMethod: string;
  cardNumber: string;
  expiryDate: string;
  cvc: string;
}

const BookingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const propertyId = new URLSearchParams(location.search).get('propertyId');
  
  const [formData, setFormData] = useState<BookingForm>({
    propertyId: propertyId || '',
    checkInDate: '',
    checkOutDate: '',
    adults: 1,
    children: 0,
    paymentMethod: 'creditCard',
    cardNumber: '',
    expiryDate: '',
    cvc: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const bookingData = {
        ...formData,
        userId: 'demo-user', // For demo purposes
        cardNumber: formData.paymentMethod === 'creditCard' ? formData.cardNumber : undefined,
        expiryDate: formData.paymentMethod === 'creditCard' ? formData.expiryDate : undefined,
        cvc: formData.paymentMethod === 'creditCard' ? formData.cvc : undefined
      };
      await createBooking(bookingData);
      alert('Booking successful!');
      navigate('/bookings');
    } catch (error) {
      alert('Failed to create booking. Please try again.');
      console.error('Booking error:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Book Your Stay</h1>
      <form onSubmit={handleSubmit} className={styles.bookingForm}>
        <div className={styles.datePicker}>
          <div className={styles.formGroup}>
            <label htmlFor="checkInDate" className={styles.label}>Check-in Date</label>
            <input
              type="date"
              id="checkInDate"
              name="checkInDate"
              value={formData.checkInDate}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="checkOutDate" className={styles.label}>Check-out Date</label>
            <input
              type="date"
              id="checkOutDate"
              name="checkOutDate"
              value={formData.checkOutDate}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
        </div>

        <div className={styles.guestSelector}>
          <div className={styles.formGroup}>
            <label htmlFor="adults" className={styles.label}>Adults</label>
            <input
              type="number"
              id="adults"
              name="adults"
              value={formData.adults}
              onChange={handleChange}
              className={styles.input}
              min="1"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="children" className={styles.label}>Children</label>
            <input
              type="number"
              id="children"
              name="children"
              value={formData.children}
              onChange={handleChange}
              className={styles.input}
              min="0"
            />
          </div>
        </div>

        <div className={styles.paymentSection}>
          <h2>Payment Information</h2>
          <div className={styles.formGroup}>
            <label htmlFor="paymentMethod" className={styles.label}>Payment Method</label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className={styles.input}
              required
            >
              <option value="creditCard">Credit Card</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>

          {formData.paymentMethod === 'creditCard' && (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="cardNumber" className={styles.label}>Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  className={styles.input}
                  pattern="[0-9]{16}"
                  required
                />
              </div>
              <div className={styles.datePicker}>
                <div className={styles.formGroup}>
                  <label htmlFor="expiryDate" className={styles.label}>Expiry Date</label>
                  <input
                    type="month"
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="cvc" className={styles.label}>CVC</label>
                  <input
                    type="text"
                    id="cvc"
                    name="cvc"
                    value={formData.cvc}
                    onChange={handleChange}
                    className={styles.input}
                    pattern="[0-9]{3}"
                    required
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <button type="submit" className={styles.bookButton}>
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default BookingPage;
