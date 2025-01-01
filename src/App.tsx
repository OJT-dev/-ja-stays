import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import PropertyListingPage from './pages/PropertyListingPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import BookingPage from './pages/BookingPage';
import { HostDashboard } from './pages/HostDashboard';
import { PropertySubmission } from './pages/PropertySubmission';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/properties" element={<PropertyListingPage />} />
            <Route path="/properties/:id" element={<PropertyDetailPage />} />
            <Route path="/bookings" element={<BookingPage />} />
            
            {/* Host Routes */}
            <Route path="/host">
              <Route index element={<HostDashboard />} />
              <Route path="properties/new" element={<PropertySubmission />} />
              <Route path="properties/:id/edit" element={<PropertySubmission />} />
            </Route>
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
