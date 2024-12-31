import express from 'express';
import { getProperties, createProperty, getPropertyById, updateProperty, deleteProperty } from './api/properties';
import { createBooking, getBookings, getUserBookings, updateBookingStatus } from './api/bookings';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Property routes
app.get('/api/properties', getProperties);
app.post('/api/properties', createProperty);
app.get('/api/properties/:id', getPropertyById);
app.put('/api/properties/:id', updateProperty);
app.delete('/api/properties/:id', deleteProperty);

// Booking routes
app.post('/api/bookings', createBooking);
app.get('/api/bookings', getBookings);
app.get('/api/bookings/:userId', getUserBookings);
app.put('/api/bookings/:id/status', updateBookingStatus);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to JA Stays API',
    version: '1.0.0',
    endpoints: {
      properties: '/api/properties',
      bookings: '/api/bookings'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`JA Stays server running on port ${PORT}`);
  console.log('Irie! Ready to handle your Jamaican vacation needs');
});
