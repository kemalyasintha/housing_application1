import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NewProperty, Property } from '../models/property';

@Injectable({ providedIn: 'root' })
export class PropertyApiService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = '/api/properties';

  getAll(): Observable<Property[]> {
    return this.http.get<Property[]>(this.endpoint);
  }

  getById(id: string): Observable<Property> {
    return this.http.get<Property>(`${this.endpoint}/${encodeURIComponent(id)}`);
  }

  create(property: NewProperty): Observable<Property> {
    return this.http.post<Property>(this.endpoint, {
      ...property,
      featured: false,
      createdAt: new Date().toISOString(),
    });
  }
}
