import { PropertyMatcher, UserPreferences } from '../../src/services/ai/matching';

describe('PropertyMatcher', () => {
  const testUser: UserPreferences = {
    location: 'Montego Bay',
    budget: 200,
    amenities: ['pool', 'wifi'],
    travelDates: [new Date('2024-01-15'), new Date('2024-01-20')] as [Date, Date]
  };

  const testProperty = {
    id: '123',
    location: {
      city: 'Montego Bay',
      parish: 'St. James',
      coordinates: {
        lat: 18.4667,
        lng: -77.9167
      }
    },
    pricePerNight: 180,
    amenities: ['wifi', 'pool', 'ac'],
    availability: [{
      startDate: new Date('2024-01-10'),
      endDate: new Date('2024-01-25')
    }]
  };

  describe('calculateMatchScore', () => {
    it('should return 1 for perfect match', () => {
      const score = PropertyMatcher.calculateMatchScore(testUser, testProperty);
      expect(score).toBeCloseTo(1);
    });

    it('should return lower score for different location', () => {
      const property = { 
        ...testProperty, 
        location: {
          city: 'Kingston',
          parish: 'Kingston',
          coordinates: {
            lat: 17.9714,
            lng: -76.7931
          }
        }
      };
      const score = PropertyMatcher.calculateMatchScore(testUser, property);
      expect(score).toBeLessThan(1);
    });

    it('should return lower score for higher price', () => {
      const property = { ...testProperty, price: 250 };
      const score = PropertyMatcher.calculateMatchScore(testUser, property);
      expect(score).toBeLessThan(1);
    });

    it('should return lower score for missing amenities', () => {
      const property = { ...testProperty, amenities: ['wifi'] };
      const score = PropertyMatcher.calculateMatchScore(testUser, property);
      expect(score).toBeLessThan(1);
    });

    it('should return 0 for unavailable dates', () => {
      const property = { 
        ...testProperty,
        availability: [{
          startDate: new Date('2024-02-01'),
          endDate: new Date('2024-02-10')
        }]
      };
      const score = PropertyMatcher.calculateMatchScore(testUser, property);
      expect(score).toBe(0);
    });
  });
});
