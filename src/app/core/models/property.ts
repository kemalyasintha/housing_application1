export type ListingPurpose = 'sale' | 'rent';
export type PropertyType = 'house' | 'condo' | 'townhome' | 'apartment';
export type PropertySort = 'featured' | 'price-asc' | 'price-desc' | 'newest';

export interface Property {
  id: string;
  title: string;
  purpose: ListingPurpose;
  propertyType: PropertyType;
  city: string;
  province: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  image: string;
  description: string;
  amenities: string[];
  availableFrom: string;
  featured: boolean;
  createdAt: string;
}

export interface PropertyFilters {
  query: string;
  purpose: ListingPurpose | 'all';
  propertyType: PropertyType | 'all';
  minBedrooms: number;
  maxPrice: number | null;
  sort: PropertySort;
}

export type NewProperty = Omit<Property, 'id' | 'featured' | 'createdAt'>;

export const DEFAULT_PROPERTY_FILTERS: PropertyFilters = {
  query: '',
  purpose: 'all',
  propertyType: 'all',
  minBedrooms: 0,
  maxPrice: null,
  sort: 'featured',
};
