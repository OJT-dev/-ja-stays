import { Property } from '../../src/models/Property';

describe('Property Model', () => {
  test('should create a valid property', () => {
    const property: Property = {
      id: '123',
      name: 'Beachfront Villa',
      location: {
        city: 'Montego Bay',
        parish: 'St. James',
        coordinates: {
          lat: 18.5038,
          lng: -77.9136
        }
      },
      type: 'villa',
      amenities: ['pool', 'beach access', 'wifi'],
      pricePerNight: 250,
      currency: 'USD',
      host: {
        id: 'host123',
        name: 'John Doe',
        isSuperhost: true
      },
      images: ['image1.jpg', 'image2.jpg'],
      availability: [
        {
          startDate: new Date('2023-12-01'),
          endDate: new Date('2023-12-15')
        }
      ]
    };

    expect(property).toBeDefined();
    expect(property.location.city).toBe('Montego Bay');
    expect(property.type).toBe('villa');
    expect(property.amenities).toContain('beach access');
    expect(property.host.isSuperhost).toBeTruthy();
  });

  test('should handle optional fields', () => {
    const property: Property = {
      id: '456',
      name: 'Kingston Apartment',
      location: {
        city: 'Kingston',
        parish: 'Kingston',
        coordinates: {
          lat: 17.9714,
          lng: -76.7932
        }
      },
      type: 'apartment',
      amenities: ['wifi', 'kitchen'],
      pricePerNight: 150,
      currency: 'JMD',
      host: {
        id: 'host456',
        name: 'Jane Smith',
        isSuperhost: false
      },
      images: ['image3.jpg'],
      availability: []
    };

    expect(property.rating).toBeUndefined();
    expect(property.reviewsCount).toBeUndefined();
    expect(property.availability.length).toBe(0);
  });
});
