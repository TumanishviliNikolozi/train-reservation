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

  public trainInfo:any;
  public date!:string
  public passengers!:number;
  public trainById:any;

  public formPersonalInfo!:FormGroup;

  public departureInfo:any;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if(params){
        if(params['trainInfo']){
          this.trainInfo = JSON.parse(params['trainInfo'])
        }

        if(params['rawDate']){
          this.date = params['rawDate']
        }

        if (params['passengers']) {
          this.passengers = +params['passengers'];
        }
      }

      console.log('trainInfo: ', this.trainInfo);
      console.log('rawDare: ', this.date)
      console.log('Passengers', this.passengers);
    })

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
    this.services.getTrainsById(trainId).subscribe((data:any) => {
      this.trainById = data;
      console.log(this.trainById);
    })
  }
  
  calculateFullPrice(){

  }

  sendTKTInfo(){

  }
}
