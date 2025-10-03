import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { error } from 'console';
import { HousingService } from 'src/app/services/housing.service';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.css']
})
export class PropertyListComponent implements OnInit {


properties: any; 
// =[ {
//     Id: 1,
//     Name:'Birla House',
//     Type: 'House',
//     Price: 120000,
//     Location: 'New York'
// },
// {
//     Id: 2,
//     Name: 'Erose Flat',
//     Type: 'House',
//     Price: 120000,
//     Location: 'New York'
// },
// {
//     Id: 3,
//     Name: 'Gun Hill',
//     Type: 'House',
//     Price: 120000,
//     Location: 'New York'
// },
// {
//     Id: 4,
//     Name: 'Macro Home',
//     Type: 'House',
//     Price: 120000,
//     Location: 'New York'
// },
// {
//     Id: 5,
//     Name: 'Saint Church Villa',
//     Type: 'House',
//     Price: 120000,
//     Location: 'New York'
// },
// {
//     Id: 6,
//     Name: 'Church Villa',
//     Type: 'House',
//     Price: 120000,
//     Location: 'New York'
// }
// ]


  constructor(private housingService:HousingService) { }

  ngOnInit(): void {
    this.housingService.getAllProperties().subscribe(
          data=>{
        this.properties = data;
        console.log(data);    
      }, error => {
        console.log(error);

      }
    
    )
}

}
