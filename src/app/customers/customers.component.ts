import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { APIsService } from '../services/apis.service';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-customers',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent implements OnInit{
  constructor(private router:Router, private route:ActivatedRoute, private services:APIsService){

  }

  public vagonImages:string[] = [
    "https://railway.stepprojects.ge/images/firstWagon.png",
    "https://railway.stepprojects.ge/images/midWagon.png",
    "https://railway.stepprojects.ge/images/lastWagon.png"
  ]

  public trainInfo:any;
  public date!:string
  public passengers!:number;

  public trainById:any;
  public wagonById:any;
  public wagonSeats:any[] = [];

  public formPersonalInfo!:FormGroup;

  public showPopup:boolean = false;

  ngOnInit(): void {

    if(history.state){
      this.trainInfo = history.state.trainInfo;
      this.date = history.state.rawDate;
      this.passengers = +history.state.passengers;

      // console.log('trainInfo: ', this.trainInfo);
      // console.log('rawDare: ', this.date);
      // console.log('Passengers', this.passengers);
    }


    this.formPersonalInfo = new FormGroup({
      trainId: new FormControl(this.trainInfo.id),
      date: new FormControl(this.date),
      email: new FormControl('', [Validators.email]),
      phoneNumber: new FormControl('', [Validators.required]),
      people: new FormArray([
        
      ])
    })

    for(let i=0; i<this.passengers; i++){
      (this.formPersonalInfo.get('people') as FormArray).push(
        new FormGroup({
          seatId: new FormControl('', [Validators.required]),
          name: new FormControl('', [Validators.required]),
          surname: new FormControl('', [Validators.required]),
          idNumber: new FormControl('', [Validators.required]),
          status: new FormControl('', [Validators.required]),
          payoutCompleted: new FormControl()
        })
      )
    }

    console.log(this.formPersonalInfo.value.people)
  }

  get people(): FormArray{
    return this.formPersonalInfo.get('people') as FormArray;
  }

  getTrainById(trainId:any){
    this.showPopup = true;

    this.services.getTrainsById(trainId).subscribe((data:any) => {
      this.trainById = data;
      console.log('get train:', this.trainById);
    })
  }

  getWagonById(vagonId:number){
    // console.log(vagonId)
    this.services.getVagonsById(vagonId).subscribe((data:any) => {
      this.wagonById = data;
      this.wagonSeats = this.wagonById[0].seats;
      console.log('hole wagon info:', this.wagonById);
      console.log('wagon seats:', this.wagonSeats);
    })
  }

  sendSeatInfo(seat:any){
    let nextAvailableIndex = -1;
    const peopleArray = this.people;

    nextAvailableIndex = peopleArray.controls.findIndex(control => !control.get('seatId')?.value);

    if (nextAvailableIndex !== -1) {
      peopleArray.at(nextAvailableIndex).patchValue({
        seatId: seat.seatId,
      });

      console.log(`Seat assigned to person ${nextAvailableIndex + 1}`);
    } else {
      alert('All passengers already have assigned seats!');
    }

    console.log(this.formPersonalInfo.value.people);
    this.showPopup = false;
  }

  closePopup(){
    this.showPopup = false;
  }
  
  calculateFullPrice(){

  }

  sendTKTInfo(){

  }

  console(formPersonalInfo:any){
    console.log(formPersonalInfo.value)
  }
}
