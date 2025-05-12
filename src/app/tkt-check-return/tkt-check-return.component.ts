import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { APIsService } from '../services/apis.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { TranslateModule, TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-tkt-check-return',
  imports: [FormsModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './tkt-check-return.component.html',
  styleUrl: './tkt-check-return.component.scss'
})
export class TktCheckReturnComponent implements OnInit{

  constructor(private route:ActivatedRoute, private router:Router, private services:APIsService, private translate:TranslateService){
    translate.setDefaultLang('ka');
    translate.use('ka');
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

  printTicket(){
    const printContent = document.querySelector('.ticket-sheet')?.innerHTML;
    const originalContent = document.body.innerHTML;

    if(printContent){
      document.body.innerHTML = printContent;
      window.print();

      document.body.innerHTML = originalContent;
      location.reload()
    } else {
      console.error('could not find ticket content');
    }
  }

  downloadPDF(){
    const element = document.querySelector('.ticket-sheet') as HTMLElement | null;

    if(element){
      html2canvas(element).then((carvas) => {
        const imgData = carvas.toDataURL('image/png');
        const pdf = new jsPDF();

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (carvas.height * pdfWidth) / carvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('ticket-sheet.pdf');
      }).catch((error) => {
        console.error('error generating pdf:', error);
      })
    } else {
      console.log('could not find ticket content');
    }
  }
}
