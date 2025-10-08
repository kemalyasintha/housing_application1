import { Component, OnInit } from '@angular/core';
import { Iproperty } from '../IProperty.interface';

@Component({
  selector: 'app-rent-property',
  templateUrl: './rent-property.component.html',
  styleUrls: ['./rent-property.component.css']
})
export class RentPropertyComponent implements OnInit {
properties: Array<Iproperty> = [];
  constructor() { }

  ngOnInit() {
  
  
  }


}
