import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { PropertyCardComponent } from './property/property-card/property-card.component';
import { PropertyListComponent } from './property/property-list/property-list.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import {HttpClientModule} from '@angular/common/http';
import { HousingService } from './services/housing.service';
import { Routes,RouterModule } from '@angular/router';
import { AddPropertyComponent } from './property/add-property/add-property.component';
import { RentPropertyComponent } from './property/rent-property/rent-property.component';
import { PropertyDetailComponent } from './property/property-detail/property-detail.component';
import {FormsModule} from '@angular/forms';

const appRoutes: Routes = [
    {path: '', component: PropertyListComponent},
    {path: 'rent-property', component:PropertyListComponent},
    {path: 'add-property', component: AddPropertyComponent},
    {path: 'property-detail/:id', component: PropertyDetailComponent},
    {path: '**', component: PropertyListComponent}
    //     component: PropertyDetailComponent,
    //     resolve: {prp: PropertyDetailResolverService}},
    // {path: 'user/login', component: UserLoginComponent},
    // {path: 'user/register', component: UserRegisterComponent},
    // {path: '**', component: PropertyListComponent}
];

@NgModule({
  declarations: [	
    AppComponent,
    PropertyCardComponent,
    PropertyListComponent,
    PropertyDetailComponent,
    NavBarComponent,
    AddPropertyComponent,
    RentPropertyComponent
   ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(appRoutes)

    
  ],
  providers: [HousingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
