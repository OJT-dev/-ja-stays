interface UserPreferences {
  location: {
    city: string;
    parish: string;
  };
  priceRange: {
    min: number;
    max: number;
  };
  desiredAmenities: string[];
  dates: {
    checkIn: Date;
    checkOut: Date;
  };
}

interface Property {
  location: {
    city: string;
    parish: string;
  };
  pricePerNight: number;
  amenities: string[];
  availability: {
    start: Date;
    end: Date;
  }[];
}

export class PropertyMatcher {
  static calculateMatchScore(user: UserPreferences, property: Property): number {
    // Check availability first - if dates don't match, return 0
    if (!this.isAvailable(property, user.dates.checkIn, user.dates.checkOut)) {
      return 0;
    }

    // Calculate individual scores
    const locationScore = this.calculateLocationScore(user.location, property.location);
    const priceScore = this.calculatePriceScore(property.pricePerNight, user.priceRange);
    const amenitiesScore = this.calculateAmenitiesScore(user.desiredAmenities, property.amenities);

    // All scores must be perfect for a perfect match
    if (locationScore === 1 && priceScore === 1 && amenitiesScore === 1) {
      return 1;
    }

    // Weight and combine scores
    return (
      locationScore * 0.4 +
      priceScore * 0.3 +
      amenitiesScore * 0.3
    );
  }

  private static calculateLocationScore(userLocation: UserPreferences['location'], propertyLocation: Property['location']): number {
    if (userLocation.city === propertyLocation.city && userLocation.parish === propertyLocation.parish) {
      return 1;
    }
    if (userLocation.parish === propertyLocation.parish) {
      return 0.7;
    }
    return 0.3;
  }

  private static calculatePriceScore(propertyPrice: number, userRange: UserPreferences['priceRange']): number {
    if (propertyPrice >= userRange.min && propertyPrice <= userRange.max) {
      return 1;
    }
    
    const midRange = (userRange.min + userRange.max) / 2;
    const priceDiff = Math.abs(propertyPrice - midRange);
    const maxDiff = Math.max(midRange - userRange.min, userRange.max - midRange);
    
    return Math.max(0, 1 - (priceDiff / maxDiff));
  }

  private static calculateAmenitiesScore(desired: string[], available: string[]): number {
    if (desired.length === 0) return 1;
    
    const matches = desired.filter(amenity => available.includes(amenity));
    return matches.length / desired.length;
  }

  private static isAvailable(property: Property, checkIn: Date, checkOut: Date): boolean {
    return property.availability.some(period => {
      const periodStart = new Date(period.start);
      const periodEnd = new Date(period.end);
      return checkIn >= periodStart && checkOut <= periodEnd;
    });
  }
}
