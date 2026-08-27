import { Component, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs';
import {
  DEFAULT_PROPERTY_FILTERS,
  ListingPurpose,
  PropertyFilters,
  PropertySort,
  PropertyType,
} from '../../core/models/property';
import { PropertyListViewModel, PropertyStore } from '../../core/services/property-store.service';
import { PropertyCardComponent } from '../property-card/property-card.component';

const INITIAL_VIEW_MODEL: PropertyListViewModel = {
  status: 'loading',
  properties: [],
  total: 0,
  errorMessage: null,
  filters: DEFAULT_PROPERTY_FILTERS,
};

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [PropertyCardComponent, ReactiveFormsModule],
  templateUrl: './property-list.component.html',
  styleUrl: './property-list.component.css',
})
export class PropertyListComponent {
  private readonly formBuilder = inject(FormBuilder);
  readonly store = inject(PropertyStore);

  readonly filtersForm = this.formBuilder.nonNullable.group({
    query: '',
    purpose: this.formBuilder.nonNullable.control<ListingPurpose | 'all'>('all'),
    propertyType: this.formBuilder.nonNullable.control<PropertyType | 'all'>('all'),
    minBedrooms: 0,
    maxPrice: 0,
    sort: this.formBuilder.nonNullable.control<PropertySort>('featured'),
  });

  readonly viewModel = toSignal(this.store.viewModel$, {
    initialValue: INITIAL_VIEW_MODEL,
  });

  constructor() {
    this.filtersForm.valueChanges
      .pipe(
        startWith(null),
        debounceTime(150),
        map(() => this.filtersForm.getRawValue()),
        map((value): PropertyFilters => ({
          query: value.query,
          purpose: value.purpose,
          propertyType: value.propertyType,
          minBedrooms: Number(value.minBedrooms),
          maxPrice: Number(value.maxPrice) > 0 ? Number(value.maxPrice) : null,
          sort: value.sort,
        })),
        distinctUntilChanged(
          (previous, current) => JSON.stringify(previous) === JSON.stringify(current),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((filters) => this.store.setFilters(filters));
  }

  resetFilters(): void {
    this.filtersForm.reset({
      query: '',
      purpose: 'all',
      propertyType: 'all',
      minBedrooms: 0,
      maxPrice: 0,
      sort: 'featured',
    });
  }
}
