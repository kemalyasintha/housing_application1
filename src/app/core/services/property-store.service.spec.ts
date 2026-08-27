import { Property, PropertyFilters } from '../models/property';
import { filterAndSortProperties } from './property-store.service';

const properties: Property[] = [
  {
    id: 'surrey-townhome',
    title: 'Transit-friendly townhome',
    purpose: 'sale',
    propertyType: 'townhome',
    city: 'Surrey',
    province: 'BC',
    price: 820000,
    bedrooms: 3,
    bathrooms: 3,
    areaSqFt: 1600,
    image: 'prop-1.png',
    description: 'A bright townhome close to rapid transit.',
    amenities: ['Garage'],
    availableFrom: '2026-09-15',
    featured: true,
    createdAt: '2026-08-18T10:00:00.000Z',
  },
  {
    id: 'vancouver-suite',
    title: 'Garden suite',
    purpose: 'rent',
    propertyType: 'apartment',
    city: 'Vancouver',
    province: 'BC',
    price: 2800,
    bedrooms: 1,
    bathrooms: 1,
    areaSqFt: 650,
    image: 'prop-2.png',
    description: 'A private garden suite close to the beach.',
    amenities: ['Patio'],
    availableFrom: '2026-09-01',
    featured: false,
    createdAt: '2026-08-24T10:00:00.000Z',
  },
  {
    id: 'burnaby-condo',
    title: 'Mountain-view condo',
    purpose: 'sale',
    propertyType: 'condo',
    city: 'Burnaby',
    province: 'BC',
    price: 710000,
    bedrooms: 2,
    bathrooms: 2,
    areaSqFt: 900,
    image: 'prop-3.png',
    description: 'A corner condo with mountain views.',
    amenities: ['Gym'],
    availableFrom: '2026-10-01',
    featured: false,
    createdAt: '2026-08-22T10:00:00.000Z',
  },
];

const defaultFilters: PropertyFilters = {
  query: '',
  purpose: 'all',
  propertyType: 'all',
  minBedrooms: 0,
  maxPrice: null,
  sort: 'featured',
};

describe('filterAndSortProperties', () => {
  it('combines search, listing type and bedroom filters', () => {
    const result = filterAndSortProperties(properties, {
      ...defaultFilters,
      query: 'surrey',
      purpose: 'sale',
      minBedrooms: 3,
    });

    expect(result.map((property) => property.id)).toEqual(['surrey-townhome']);
  });

  it('sorts without mutating the API response', () => {
    const originalOrder = properties.map((property) => property.id);
    const result = filterAndSortProperties(properties, {
      ...defaultFilters,
      sort: 'price-asc',
    });

    expect(result.map((property) => property.id)).toEqual([
      'vancouver-suite',
      'burnaby-condo',
      'surrey-townhome',
    ]);
    expect(properties.map((property) => property.id)).toEqual(originalOrder);
  });
});
