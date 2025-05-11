import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIsService } from '../services/apis.service';
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf';

@Component({
  selector: 'app-tkt-confirmed',
  imports: [],
  templateUrl: './tkt-confirmed.component.html',
  styleUrl: './tkt-confirmed.component.scss'
})
export class TktConfirmedComponent implements OnInit {

  constructor(private route:ActivatedRoute, private router:Router, private services:APIsService){

  }

  public trueIdSaver!:string;
  public paymentInfo:any;
  public hiddenCardNumber!:string;
  public ticketBoughtOn!:string;

  public ticketInfo:any;

  ngOnInit(): void {
    if(history.state){
      this.trueIdSaver = history.state.trueTktId;
      this.paymentInfo = history.state.paymentInfo;
      this.ticketBoughtOn = new Date(history.state.tktBoughtOn).toISOString().slice(0, 10);

      console.log('racieved id:', this.trueIdSaver);
      console.log('payment info:', this.paymentInfo);
      console.log('ticket sold on:', this.ticketBoughtOn);

      this.hiddenCardNumber = this.maskCardNumber(this.paymentInfo.cardNumber);
    }

    this.services.getTicketCheckStatusById(this.trueIdSaver).subscribe((data:any) => {
      this.ticketInfo = data;
      console.log('my ticket info:', this.ticketInfo);
    })
  }


  maskCardNumber(cardNumber:string){
    return cardNumber.slice(0, 4) + '********' + cardNumber.slice(-4);
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
