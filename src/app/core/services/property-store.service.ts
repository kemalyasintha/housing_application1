import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  map,
  Observable,
  of,
  shareReplay,
  startWith,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import {
  DEFAULT_PROPERTY_FILTERS,
  NewProperty,
  Property,
  PropertyFilters,
} from '../models/property';
import { PropertyApiService } from './property-api.service';

export interface PropertyListViewModel {
  status: 'loading' | 'success' | 'error';
  properties: Property[];
  total: number;
  errorMessage: string | null;
  filters: PropertyFilters;
}

interface PropertyLoadState {
  status: 'loading' | 'success' | 'error';
  properties: Property[];
  errorMessage: string | null;
}

@Injectable({ providedIn: 'root' })
export class PropertyStore {
  private readonly api = inject(PropertyApiService);
  private readonly filtersSubject = new BehaviorSubject<PropertyFilters>(DEFAULT_PROPERTY_FILTERS);
  private readonly refreshSubject = new Subject<void>();

  private readonly loadState$ = this.refreshSubject.pipe(
    startWith(undefined),
    switchMap(() =>
      this.api.getAll().pipe(
        map((properties): PropertyLoadState => ({
          status: 'success',
          properties,
          errorMessage: null,
        })),
        catchError(() =>
          of<PropertyLoadState>({
            status: 'error',
            properties: [],
            errorMessage: 'Listings could not be loaded. Confirm that the local API is running.',
          }),
        ),
        startWith<PropertyLoadState>({
          status: 'loading',
          properties: [],
          errorMessage: null,
        }),
      ),
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly viewModel$: Observable<PropertyListViewModel> = combineLatest([
    this.loadState$,
    this.filtersSubject,
  ]).pipe(
    map(([state, filters]) => {
      const properties = filterAndSortProperties(state.properties, filters);

      return {
        ...state,
        properties,
        total: properties.length,
        filters,
      };
    }),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  setFilters(filters: PropertyFilters): void {
    this.filtersSubject.next(filters);
  }

  refresh(): void {
    this.refreshSubject.next();
  }

  create(property: NewProperty): Observable<Property> {
    return this.api.create(property).pipe(tap(() => this.refresh()));
  }
}

export function filterAndSortProperties(
  properties: Property[],
  filters: PropertyFilters,
): Property[] {
  const query = filters.query.trim().toLocaleLowerCase();

  const filtered = properties.filter((property) => {
    const matchesQuery =
      !query ||
      [property.title, property.city, property.province, property.propertyType].some((value) =>
        value.toLocaleLowerCase().includes(query),
      );
    const matchesPurpose = filters.purpose === 'all' || property.purpose === filters.purpose;
    const matchesType =
      filters.propertyType === 'all' || property.propertyType === filters.propertyType;
    const matchesBedrooms = property.bedrooms >= filters.minBedrooms;
    const matchesPrice = filters.maxPrice === null || property.price <= filters.maxPrice;

    return matchesQuery && matchesPurpose && matchesType && matchesBedrooms && matchesPrice;
  });

  return [...filtered].sort((left, right) => {
    switch (filters.sort) {
      case 'price-asc':
        return left.price - right.price;
      case 'price-desc':
        return right.price - left.price;
      case 'newest':
        return Date.parse(right.createdAt) - Date.parse(left.createdAt);
      case 'featured':
        return Number(right.featured) - Number(left.featured) || right.price - left.price;
    }
  });
}
