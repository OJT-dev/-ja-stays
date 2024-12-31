/**
 * Einstein-inspired property matching algorithm
 * 
 * Implements a quantum-inspired matching system that considers:
 * - User preferences
 * - Property characteristics
 * - Temporal factors
 * - Local context
 */

export interface UserPreferences {
  location: string;
  budget: number;
  amenities: string[];
  travelDates: [Date, Date];
}

interface Property {
  id: string;
  location: {
    city: string;
    parish: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  pricePerNight: number;
  amenities: string[];
  availability: {
    startDate: Date;
    endDate: Date;
  }[];
}

export class PropertyMatcher {
  /**
   * Calculate match score between user preferences and property
   * @param user User preferences
   * @param property Property to match against
   * @returns Match score (0-1)
   */
  static calculateMatchScore(user: UserPreferences, property: Property): number {
    // Location similarity (quantum-inspired probability)
    const locationScore = this.calculateLocationScore(user.location, property.location);
    
    // Budget compatibility (fuzzy logic)
    const budgetScore = this.calculateBudgetScore(user.budget, property.pricePerNight);
    
    // Amenities overlap (set theory)
    const amenitiesScore = this.calculateAmenitiesScore(user.amenities, property.amenities);
    
    // Date availability (temporal alignment)
    const dateScore = this.calculateDateScore(user.travelDates, property.availability);
    
    // Combine scores using weighted average
    return (locationScore * 0.4) + 
           (budgetScore * 0.3) + 
           (amenitiesScore * 0.2) + 
           (dateScore * 0.1);
  }

  private static calculateLocationScore(userLocation: string, propertyLocation: { city: string }): number {
    // Quantum-inspired location matching
    return userLocation === propertyLocation.city ? 1 : 0.5;
  }

  private static calculateBudgetScore(userBudget: number, propertyPricePerNight: number): number {
    // Fuzzy budget compatibility
    const ratio = propertyPricePerNight / userBudget;
    return Math.max(0, 1 - Math.abs(1 - ratio));
  }

  private static calculateAmenitiesScore(userAmenities: string[], propertyAmenities: string[]): number {
    // Set theory-based amenities matching
    const intersection = userAmenities.filter(amenity => 
      propertyAmenities.includes(amenity)
    );
    return intersection.length / userAmenities.length;
  }

  private static calculateDateScore(userDates: [Date, Date], propertyAvailability: { startDate: Date, endDate: Date }[]): number {
    // Temporal alignment scoring
    const [userStart, userEnd] = userDates;
    
    // Check if any availability period matches the user's dates
    for (const period of propertyAvailability) {
      if (userStart >= period.startDate && userEnd <= period.endDate) {
        return 1;
      }
    }
    return 0;
  }
}
