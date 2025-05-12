import { Component, ElementRef, NgModule, signal, viewChild, HostListener, AfterViewInit } from '@angular/core';
import { APIsService } from '../services/apis.service';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
import flatpickr from 'flatpickr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule, TranslateModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent implements AfterViewInit {
  constructor(private service:APIsService, private router:Router, private translate:TranslateService){
    translate.setDefaultLang('ka');
    translate.use('ka');
    this.AllStations();
  }

  public dateInput = viewChild<ElementRef>('dateInput');
  public flatCalendar:any;
  public today:Date = new Date();

  ngAfterViewInit(): void {
    this.flatCalendar = this.dateInput()?.nativeElement

    if(this.flatCalendar){
      flatpickr(this.flatCalendar, {
        dateFormat: 'Y-m-d',
        altFormat: 'F j, Y',
        minDate: this.today
      });
    }
  }

  // ------------- importing API info from servises --------------

  public myStations:any;

  AllStations():void{
    this.service.getAllStations().subscribe((data:any) => {
      this.myStations = data;
      console.log(this.myStations);
    })
  }

  // ------------- importing API info from servises (end) --------------



  public whereFrom:string = "";
  public destination:string = "";
  public date:string = "";
  public passengers:number = 1;

  passengerNumber(passenger:number){
    // console.log(passenger)
    this.passengers += passenger;

    if(this.passengers < 1){
      this.passengers = 1;
    }
    // console.log(this.passengers)
  }

  startingStation(name:any){
    this.whereFrom = name;
    // console.log(this.whereFrom);
  }

  endingStation(name:any){
    this.destination = name;
    // console.log(this.destination);
  }

  onSubmit(){
    console.log(this.whereFrom);
    console.log(this.destination);
    console.log(this.date);
    console.log(this.passengers);

    this.router.navigate(['/რეისები'], {
      queryParams: {
        whereFrom: this.whereFrom,
        destination: this.destination,
        date: this.date,
        passengers: this.passengers
      }
    })
  }

  reset(){
    this.whereFrom = "";
    this.destination = ""
    this.date = "";
    this.passengers = 1;
  }





  // --------------------- dropdown manus ---------------------

  

  departureDropdown = viewChild<ElementRef>('departureElement');
  arrivalDropdown = viewChild<ElementRef>('ArrivalElement');

  isActiveDeparture = signal(false);
  isActiveArrival = signal(false)

  toggleDepartureClass(){
    this.isActiveDeparture.update((value) => !value);
    // console.log(this.isActiveDeparture())
  }

  toggleArrivalClass(){
    this.isActiveArrival.update((value) => !value);
    // console.log(this.isActiveArrival())
  }

  @HostListener('document:click', ['$event'])

  handleOutsideClick(event: MouseEvent){
    // console.log('CLICK:', event.target);
    const departureDropdownContainer = this.departureDropdown();
    const arrivalDropdownContainer = this.arrivalDropdown();

    const departureClickedInside = departureDropdownContainer?.nativeElement.contains(event.target);
    const arrivalClickedInside = arrivalDropdownContainer?.nativeElement.contains(event.target);

    // console.log('Inside?', clickedInside);
    if(!departureClickedInside){
      this.isActiveDeparture.set(false);
    }

    if(!arrivalClickedInside){
      this.isActiveArrival.set(false);
    }
  }
  

}
