import { Property } from '../models/Property';

export interface PropertySubmissionData {
  name: string;
  description: string;
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
  images: File[];
}

interface BookingData {
  propertyId: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  paymentMethod: string;
  cardNumber?: string;
  expiryDate?: string;
  cvc?: string;
}

const API_BASE_URL = '/api';

// Helper function to handle file uploads
const uploadImages = async (files: File[]): Promise<string[]> => {
  const formData = new FormData();
  files.forEach((file) => formData.append('images', file));

  try {
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload images');
    }

    return response.json();
  } catch (error) {
    console.error('Error uploading images:', error);
    throw error;
  }
};

export const getProperties = async (): Promise<Property[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/properties`);
    if (!response.ok) {
      throw new Error('Failed to fetch properties');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
};

export const getProperty = async (id: string): Promise<Property> => {
  try {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch property');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching property:', error);
    throw error;
  }
};

export const createProperty = async (propertyData: PropertySubmissionData): Promise<Property> => {
  try {
    // First upload images and get their URLs
    const imageUrls = await uploadImages(propertyData.images);

    // Create property with image URLs and default values
    const response = await fetch(`${API_BASE_URL}/properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...propertyData,
        images: imageUrls,
        rating: 0,
        reviewsCount: 0,
        host: {
          // TODO: Get actual host data from auth context
          id: '1',
          name: 'Host Name',
          isSuperhost: false,
        },
        availability: [],
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create property');
    }

    return response.json();
  } catch (error) {
    console.error('Error creating property:', error);
    throw error;
  }
};

export const updateProperty = async (id: string, propertyData: PropertySubmissionData): Promise<Property> => {
  try {
    // Upload any new images
    const imageUrls = propertyData.images.length > 0 ? await uploadImages(propertyData.images) : [];

    // Get existing property to preserve some fields
    const existingProperty = await getProperty(id);

    // Update property with new data and image URLs
    const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...propertyData,
        images: [...existingProperty.images, ...imageUrls],
        rating: existingProperty.rating,
        reviewsCount: existingProperty.reviewsCount,
        host: existingProperty.host,
        availability: existingProperty.availability,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update property');
    }

    return response.json();
  } catch (error) {
    console.error('Error updating property:', error);
    throw error;
  }
};

export const createBooking = async (bookingData: BookingData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      throw new Error('Failed to create booking');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const getBookings = async (userId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
};
