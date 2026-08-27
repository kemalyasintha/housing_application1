import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NewProperty, Property } from '../models/property';
import { PropertyApiService } from './property-api.service';

describe('PropertyApiService', () => {
  let service: PropertyApiService;
  let http: HttpTestingController;

  const property: Property = {
    id: 'surrey-home',
    title: 'Surrey family home',
    purpose: 'sale',
    propertyType: 'house',
    city: 'Surrey',
    province: 'BC',
    price: 975000,
    bedrooms: 3,
    bathrooms: 2,
    areaSqFt: 1800,
    image: 'house_default.png',
    description: 'A well-located family home with flexible living space.',
    amenities: ['Garage'],
    availableFrom: '2026-09-01',
    featured: false,
    createdAt: '2026-08-20T10:00:00.000Z',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PropertyApiService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(PropertyApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads typed properties from the REST endpoint', () => {
    service.getAll().subscribe((properties) => expect(properties).toEqual([property]));

    const request = http.expectOne('/api/properties');
    expect(request.request.method).toBe('GET');
    request.flush([property]);
  });

  it('posts a new listing with server-managed metadata', () => {
    const input: NewProperty = {
      title: property.title,
      purpose: property.purpose,
      propertyType: property.propertyType,
      city: property.city,
      province: property.province,
      price: property.price,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      areaSqFt: property.areaSqFt,
      image: property.image,
      description: property.description,
      amenities: property.amenities,
      availableFrom: property.availableFrom,
    };

    service.create(input).subscribe((created) => expect(created).toEqual(property));

    const request = http.expectOne('/api/properties');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toMatchObject({
      ...input,
      featured: false,
    });
    expect(request.request.body.createdAt).toEqual(expect.any(String));
    request.flush(property);
  });
});
