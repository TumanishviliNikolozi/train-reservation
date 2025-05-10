import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { APIsService } from '../services/apis.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-tkt-check-return',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './tkt-check-return.component.html',
  styleUrl: './tkt-check-return.component.scss'
})
export class TktCheckReturnComponent implements OnInit{

  constructor(private route:ActivatedRoute, private router:Router, private services:APIsService){

  }

  public checkTicket!:FormGroup;

  public trueIdSaver!:string;
  public paymentInfo:any;
  public hiddenCardNumber!:string;
  public ticketBoughtOn!:string;

  public ticketInfo:any;

  ngOnInit(): void {
    
    this.checkTicket = new FormGroup({
      ticketId: new FormControl('', [Validators.required])
    });

    // this.trueIdSaver = this.checkTicket.ticketId;
    // if(history.state){
    //   this.trueIdSaver = history.state.trueTktId;
    //   this.paymentInfo = history.state.paymentInfo;
    //   this.ticketBoughtOn = new Date().toISOString().slice(0, 10);

    //   console.log('racieved id:', this.trueIdSaver);
    //   console.log('payment info:', this.paymentInfo);
    //   console.log('ticket sold on:', this.ticketBoughtOn);

    //   this.hiddenCardNumber = this.maskCardNumber(this.paymentInfo.cardNumber);
    // }

    // this.services.getTicketCheckStatusById(this.trueIdSaver).subscribe((data:any) => {
    //   this.ticketInfo = data;
    //   console.log('my ticket info:', this.ticketInfo);
    // })
  }

  checkMyTicketId(ticketId:any){
    console.log('ticket input:', ticketId);

    this.services.getTicketCheckStatusById(ticketId).subscribe((response) => {
      this.ticketInfo = response;

      console.log(response);
      console.log(this.ticketInfo.persons[0].name)
    })
  }


  // maskCardNumber(cardNumber:string){
  //   return cardNumber.slice(0, 4) + '********' + cardNumber.slice(-4);
  // }

}
