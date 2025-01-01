import { PropertyMatcher } from '../../src/services/ai/matching';

describe('PropertyMatcher', () => {
  describe('calculateMatchScore', () => {
    const testUser = {
      location: {
        city: 'Montego Bay',
        parish: 'St. James',
      },
      priceRange: {
        min: 80,
        max: 120,
      },
      desiredAmenities: ['WiFi', 'Pool'],
      dates: {
        checkIn: new Date('2024-01-01'),
        checkOut: new Date('2024-01-07'),
      },
    };

    const testProperty = {
      location: {
        city: 'Montego Bay',
        parish: 'St. James',
      },
      pricePerNight: 100,
      amenities: ['WiFi', 'Pool'],
      availability: [{
        start: new Date('2023-12-01'),
        end: new Date('2024-12-31'),
      }],
    };

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
        },
      };
      const score = PropertyMatcher.calculateMatchScore(testUser, property);
      expect(score).toBeLessThan(1);
    });

    it('should return lower score for higher price', () => {
      const property = {
        ...testProperty,
        pricePerNight: 200,
      };
      const score = PropertyMatcher.calculateMatchScore(testUser, property);
      expect(score).toBeLessThan(1);
    });

    it('should return lower score for missing amenities', () => {
      const property = {
        ...testProperty,
        amenities: ['WiFi'],
      };
      const score = PropertyMatcher.calculateMatchScore(testUser, property);
      expect(score).toBeLessThan(1);
    });

    it('should return 0 for unavailable dates', () => {
      const property = {
        ...testProperty,
        availability: [{
          start: new Date('2023-01-01'),
          end: new Date('2023-12-31'),
        }],
      };
      const score = PropertyMatcher.calculateMatchScore(testUser, property);
      expect(score).toBe(0);
    });
  });
});
