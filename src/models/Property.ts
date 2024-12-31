/**
 * Property model representing a Jamaican vacation rental
 */
export interface Property {
  id: string;
  name: string;
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
  rating?: number;
  reviewsCount?: number;
  host: {
    id: string;
    name: string;
    isSuperhost: boolean;
  };
  images: string[];
  availability: {
    startDate: Date;
    endDate: Date;
  }[];
}
