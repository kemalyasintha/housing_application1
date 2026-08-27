import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'properties',
  },
  {
    path: 'properties',
    loadComponent: () =>
      import('./property/property-list/property-list.component').then(
        (module) => module.PropertyListComponent,
      ),
    title: 'Find a home | Northstar Housing',
  },
  {
    path: 'properties/new',
    loadComponent: () =>
      import('./property/add-property/add-property.component').then(
        (module) => module.AddPropertyComponent,
      ),
    title: 'Create a listing | Northstar Housing',
  },
  {
    path: 'properties/:id',
    loadComponent: () =>
      import('./property/property-detail/property-detail.component').then(
        (module) => module.PropertyDetailComponent,
      ),
    title: 'Property details | Northstar Housing',
  },
  {
    path: '**',
    redirectTo: 'properties',
  },
];
