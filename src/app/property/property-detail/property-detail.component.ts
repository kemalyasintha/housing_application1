import { CurrencyPipe, DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, distinctUntilChanged, filter, map, of, startWith, switchMap } from 'rxjs';
import { Property } from '../../core/models/property';
import { PropertyApiService } from '../../core/services/property-api.service';

interface DetailViewModel {
  status: 'loading' | 'success' | 'error';
  property: Property | null;
}

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, DecimalPipe, RouterLink, TitleCasePipe],
  templateUrl: './property-detail.component.html',
  styleUrl: './property-detail.component.css',
})
export class PropertyDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(PropertyApiService);

  private readonly state$ = this.route.paramMap.pipe(
    map((params) => params.get('id')),
    filter((id): id is string => Boolean(id)),
    distinctUntilChanged(),
    switchMap((id) =>
      this.api.getById(id).pipe(
        map((property): DetailViewModel => ({
          status: 'success',
          property,
        })),
        catchError(() =>
          of<DetailViewModel>({
            status: 'error',
            property: null,
          }),
        ),
        startWith<DetailViewModel>({
          status: 'loading',
          property: null,
        }),
      ),
    ),
  );

  readonly state = toSignal(this.state$, {
    initialValue: {
      status: 'loading',
      property: null,
    } satisfies DetailViewModel,
  });
}
