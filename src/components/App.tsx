import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import PropertyListingPage from '../pages/PropertyListingPage';
import PropertyDetailPage from '../pages/PropertyDetailPage';
import BookingPage from '../pages/BookingPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/properties" element={<PropertyListingPage />} />
        <Route path="/properties/:id" element={<PropertyDetailPage />} />
        <Route path="/bookings" element={<BookingPage />} />
      </Routes>
    </Router>
  );
};

export default App;
