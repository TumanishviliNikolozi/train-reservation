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
  // public paymentInfo:any;
  // public hiddenCardNumber!:string;
  // public ticketBoughtOn!:string;

  public deleteComplited:any;
  // public deleteComplited:any = "aaaaaaa aaaaaaaa aaaaaaaaaaa aaaaaaaaaa aaaaaaaaaaaaaaaaa aaaaa aaaaaa aaaaaaaaaaaaaaa aaaaaaa ";
  public ticketInfo:any;

  ngOnInit(): void {
    
    this.checkTicket = new FormGroup({
      ticketId: new FormControl('', [Validators.required])
    });
  }

  checkMyTicketId(ticketId:any){
    console.log('ticket input:', ticketId);

    this.services.getTicketCheckStatusById(ticketId).subscribe((response) => {
      this.ticketInfo = response;

      console.log(response);
      console.log(this.ticketInfo.persons[0].name)
    })
  }

  deleteMyTicket(ticketId:any){
    this.services.deleteTicketById(ticketId).subscribe((response) => {
      this.deleteComplited = response;
      console.log(this.deleteComplited);
      this.ticketInfo = '';
    })
  }
}
