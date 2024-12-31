import { Request, Response } from 'express';
import { Property } from '../models/Property';

// Sample property data
export const properties: Property[] = [
  {
    id: '1',
    name: 'Beachfront Villa in Montego Bay',
    location: {
      city: 'Montego Bay',
      parish: 'St. James',
      coordinates: {
        lat: 18.4762,
        lng: -77.8939
      }
    },
    type: 'villa',
    amenities: ['pool', 'wifi', 'ac', 'beach access', 'kitchen'],
    pricePerNight: 350,
    currency: 'USD',
    rating: 4.8,
    reviewsCount: 124,
    host: {
      id: 'h1',
      name: 'Marcus Brown',
      isSuperhost: true
    },
    images: ['/images/montego-bay-villa.jpg'],
    availability: [
      {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31')
      }
    ]
  },
  {
    id: '2',
    name: 'Luxury Apartment in Kingston',
    location: {
      city: 'Kingston',
      parish: 'St. Andrew',
      coordinates: {
        lat: 18.0179,
        lng: -76.8099
      }
    },
    type: 'apartment',
    amenities: ['wifi', 'ac', 'gym', 'parking', 'security'],
    pricePerNight: 200,
    currency: 'USD',
    rating: 4.6,
    reviewsCount: 89,
    host: {
      id: 'h2',
      name: 'Sarah Williams',
      isSuperhost: true
    },
    images: ['/images/kingston-apartment.jpg'],
    availability: [
      {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31')
      }
    ]
  },
  {
    id: '3',
    name: 'Cozy Beach House in Negril',
    location: {
      city: 'Negril',
      parish: 'Westmoreland',
      coordinates: {
        lat: 18.2696,
        lng: -78.3518
      }
    },
    type: 'beach house',
    amenities: ['wifi', 'ac', 'beach access', 'kitchen', 'bbq'],
    pricePerNight: 275,
    currency: 'USD',
    rating: 4.9,
    reviewsCount: 156,
    host: {
      id: 'h3',
      name: 'David Thompson',
      isSuperhost: false
    },
    images: ['/images/negril-beach-house.jpg'],
    availability: [
      {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31')
      }
    ]
  }
];

/**
 * Get all properties with optional Jamaican location filters
 */
export const getProperties = (req: Request, res: Response) => {
  const { city, parish } = req.query;
  
  let filteredProperties = properties;
  
  if (city) {
    filteredProperties = filteredProperties.filter(
      p => p.location.city.toLowerCase() === (city as string).toLowerCase()
    );
  }
  
  if (parish) {
    filteredProperties = filteredProperties.filter(
      p => p.location.parish.toLowerCase() === (parish as string).toLowerCase()
    );
  }

  res.json(filteredProperties);
};

/**
 * Create a new Jamaican property listing
 */
export const createProperty = (req: Request, res: Response) => {
  const newProperty: Property = {
    ...req.body,
    currency: req.body.currency || 'JMD' // Default to Jamaican dollars
  };
  
  properties.push(newProperty);
  res.status(201).json(newProperty);
};

/**
 * Get property details by ID
 */
export const getPropertyById = (req: Request, res: Response) => {
  const property = properties.find(p => p.id === req.params.id);
  
  if (!property) {
    return res.status(404).json({ message: 'Property not found' });
  }
  
  res.json(property);
};

/**
 * Update property details
 */
export const updateProperty = (req: Request, res: Response) => {
  const index = properties.findIndex(p => p.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Property not found' });
  }
  
  properties[index] = { ...properties[index], ...req.body };
  res.json(properties[index]);
};

/**
 * Delete a property listing
 */
export const deleteProperty = (req: Request, res: Response) => {
  const index = properties.findIndex(p => p.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Property not found' });
  }
  
  properties.splice(index, 1);
  res.status(204).send();
};
