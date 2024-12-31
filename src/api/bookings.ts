import { Request, Response } from 'express';

interface Booking {
  id: string;
  propertyId: string;
  userId: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentMethod: string;
}

// In-memory store for demo purposes
const bookings: Booking[] = [];

export const createBooking = (req: Request, res: Response) => {
  const newBooking: Booking = {
    id: Math.random().toString(36).substr(2, 9),
    ...req.body,
    status: 'pending'
  };
  
  bookings.push(newBooking);
  res.status(201).json(newBooking);
};

export const getBookings = (req: Request, res: Response) => {
  res.json(bookings);
};

export const getUserBookings = (req: Request, res: Response) => {
  const userBookings = bookings.filter(booking => booking.userId === req.params.userId);
  res.json(userBookings);
};

export const updateBookingStatus = (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const bookingIndex = bookings.findIndex(booking => booking.id === id);
  
  if (bookingIndex === -1) {
    return res.status(404).json({ message: 'Booking not found' });
  }
  
  bookings[bookingIndex].status = status;
  res.json(bookings[bookingIndex]);
};

export const getBookingById = (req: Request, res: Response) => {
  const booking = bookings.find(b => b.id === req.params.id);
  
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }
  
  res.json(booking);
};
