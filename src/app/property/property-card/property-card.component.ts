import { CurrencyPipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Property } from '../../core/models/property';

@Component({
  selector: 'app-property-card',
  standalone: true,
  imports: [CurrencyPipe, DecimalPipe, RouterLink, TitleCasePipe],
  templateUrl: './property-card.component.html',
  styleUrl: './property-card.component.css',
})
export class PropertyCardComponent {
  readonly property = input.required<Property>();
}
