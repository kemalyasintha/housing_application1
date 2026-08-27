import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ListingPurpose, NewProperty, PropertyType } from '../../core/models/property';
import { PropertyStore } from '../../core/services/property-store.service';

@Component({
  selector: 'app-add-property',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './add-property.component.html',
  styleUrl: './add-property.component.css',
})
export class AddPropertyComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly store = inject(PropertyStore);

  readonly submitting = signal(false);
  readonly submissionError = signal<string | null>(null);

  readonly form = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(80)]],
    purpose: this.formBuilder.nonNullable.control<ListingPurpose>('sale'),
    propertyType: this.formBuilder.nonNullable.control<PropertyType>('house'),
    city: ['', [Validators.required, Validators.maxLength(60)]],
    province: ['BC', [Validators.required, Validators.maxLength(2)]],
    price: [0, [Validators.required, Validators.min(1)]],
    bedrooms: [1, [Validators.required, Validators.min(0), Validators.max(20)]],
    bathrooms: [1, [Validators.required, Validators.min(0), Validators.max(20)]],
    areaSqFt: [500, [Validators.required, Validators.min(100)]],
    availableFrom: [new Date().toISOString().slice(0, 10), Validators.required],
    description: ['', [Validators.required, Validators.minLength(30), Validators.maxLength(800)]],
    amenities: ['', Validators.required],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.submissionError.set(null);

    const value = this.form.getRawValue();
    const property: NewProperty = {
      title: value.title.trim(),
      purpose: value.purpose,
      propertyType: value.propertyType,
      city: value.city.trim(),
      province: value.province.trim().toLocaleUpperCase(),
      price: Number(value.price),
      bedrooms: Number(value.bedrooms),
      bathrooms: Number(value.bathrooms),
      areaSqFt: Number(value.areaSqFt),
      availableFrom: value.availableFrom,
      description: value.description.trim(),
      amenities: value.amenities
        .split(',')
        .map((amenity) => amenity.trim())
        .filter(Boolean),
      image: 'house_default.png',
    };

    this.store
      .create(property)
      .pipe(
        finalize(() => this.submitting.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (created) => void this.router.navigate(['/properties', created.id]),
        error: () =>
          this.submissionError.set(
            'The listing could not be saved. Confirm that the local REST API is running.',
          ),
      });
  }
}
