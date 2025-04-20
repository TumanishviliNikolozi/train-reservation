import { Component } from '@angular/core';
import { APIsService } from '../services/apis.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(public service:APIsService, private router:Router){
    this.AllStations();
  }

  public myStations:any;

  AllStations():void{
    this.service.getAllStations().subscribe((data:any) => {
      this.myStations = data;
      console.log(this.myStations);
    })
  }

  public whereFrom:string = "";
  public destination:string = "";
  public date:string = "";
  public passengers:number = 1;

  onSubmit(){
    this.router.navigate(['/რეისები'], {
      queryParams: {
        whereFrom: this.whereFrom,
        destination:this.destination,
        date:this.date,
        passengers:this.passengers
      }
    })
  }

}
