import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { APIsService } from '../services/apis.service';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { cardExpiryDateValidator } from '../validators/card-expiry.validator';

@Component({
  selector: 'app-customers',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent implements OnInit{
  constructor(private router:Router, private route:ActivatedRoute, private services:APIsService, private http:HttpClient, private fb: FormBuilder){
    this.getWagons();

    if(history.state){
      this.trainInfo = history.state.trainInfo;
      this.date = history.state.rawDate;
      this.passengers = +history.state.passengers;

      // console.log('trainInfo: ', this.trainInfo);
      // console.log('rawDare: ', this.date);
      // console.log('Passengers', this.passengers);
    }

    for(let i=0; i<this.passengers; i++){
      this.selectedSeatPrice[i] = 0;
    }
  }

  public vagonImages:string[] = [
    "https://railway.stepprojects.ge/images/firstWagon.png",
    "https://railway.stepprojects.ge/images/midWagon.png",
    "https://railway.stepprojects.ge/images/lastWagon.png"
  ]

  public trainInfo:any;
  public date!:string
  public passengers!:number;

  public getFullWagonList:any;

  public trainById:any;
  public selectedPassengerIndex!:number;
  public wagonById:any;
  public wagonSeats:any[] = [];
  public sortedWagonSeats:any[] = [];
  public selectedSeat:any;
  public selectedSeatNumber:string[] = [];
  public selectedSeatPrice:number[] = [];
  public selectedSeatVagonId:number[] = [];
  public wagonName:string = '';

  public selectedSeatIds: Map<number, string> = new Map();
  public existingSeatId:any;
  public previousWagon:any;
  public previousSeat:any;
  public totalPrice:number = 0;
  public seatVagonId:number = 0;

  public invoiceCheckbox:boolean = false;

  public formPersonalInfo!:FormGroup;
  public paymentForm!:FormGroup;

  public showPopup:boolean = false;
  public showPaymentPopup:boolean = false;
  public trueIdSaver!:string;

  ngOnInit(): void {

    this.formPersonalInfo = new FormGroup({
      trainId: new FormControl(this.trainInfo.id),
      date: new FormControl(this.date),
      email: new FormControl('', [Validators.email]),
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{9}$')]),
      people: new FormArray([
        
      ])
    })

    for(let i=0; i<this.passengers; i++){
      (this.formPersonalInfo.get('people') as FormArray).push(
        new FormGroup({
          seatId: new FormControl('', [Validators.required]),
          name: new FormControl('', [Validators.required]),
          surname: new FormControl('', [Validators.required]),
          idNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{11}$')]),
          status: new FormControl('confirmed', [Validators.required]),
          payoutCompleted: new FormControl(true, [Validators.required])
        })
      )
    }

    console.log(this.formPersonalInfo.value.people)


    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      cardHolder: ['', [Validators.required]],
      expiryDate: ['', [Validators.required, cardExpiryDateValidator()]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
    });

  }

  get people(): FormArray{
    return this.formPersonalInfo.get('people') as FormArray;
  }

  formatCardNumber(event: Event) {
    const input = event.target as HTMLInputElement;
    let rawValue = input.value.replace(/\D/g, '');

    if (rawValue.length > 16) {
      rawValue = rawValue.substring(0, 16);
    }

    const formatted = rawValue.replace(/(\d{4})(?=\d)/g, '$1 ');
    this.paymentForm.get('cardNumber')?.setValue(rawValue, { emitEvent: false });

    input.value = formatted;
  }

  formatCustomerName(event: Event) {
    const input = event.target as HTMLInputElement;
  
    let value = input.value.replace(/\s+/g, ' ').trim();
  
    value = value.replace(/\b\w/g, char => char.toUpperCase());
  
    input.value = value;
  
    this.paymentForm.get('customerName')?.setValue(value, { emitEvent: false });
  }

  getTrainById(trainId:any){
    this.showPopup = true;

    this.services.getTrainsById(trainId).subscribe((data:any) => {
      this.trainById = data;
      // console.log('get train:', this.trainById);
    })
  }

  getWagons(){
    this.services.getAllVagons().subscribe((data:any) => {
      this.getFullWagonList = data;
      // console.log(this.getFullWagonList)
    })
  }

  getPassengerIndex(event:Event, index:number){
    event.preventDefault();
    this.selectedPassengerIndex = index;
  }

  

  getWagonById(vagonId:number){
    // console.log(vagonId)
    this.services.getVagonsById(vagonId).subscribe((data:any) => {
      this.wagonById = data;
      this.wagonName = this.wagonById[0].name;
      this.wagonSeats = this.wagonById[0].seats;
      console.log('hole wagon info:', this.wagonById);
      console.log('wagon name:', this.wagonName);
      console.log('wagon seats:', this.wagonSeats);

      this.sortedWagonSeats = [...this.wagonSeats].sort((a, b) => {
        const [aRow, aSeat] = a.number.match(/^(\d+)([A-Z])$/)!.slice(1);
        const [bRow, bSeat] = b.number.match(/^(\d+)([A-Z])$/)!.slice(1);

        const rowCompare = Number(aRow) - Number(bRow);
        if (rowCompare !== 0) return rowCompare;

        return aSeat.localeCompare(bSeat)
      })

      // console.log(this.sortedWagonSeats)
    })
  }

  sendSeatInfo(seatNumber:any){
    this.selectedSeat = this.wagonById[0]?.seats.find(
      (seat:any) => seat.number === seatNumber
    )
    console.log('selected seat:', this.selectedSeat);

    if(this.selectedSeat){
      this.selectedSeatNumber[this.selectedPassengerIndex] = this.selectedSeat.number;
      this.selectedSeatVagonId[this.selectedPassengerIndex] = this.selectedSeat.vagonId;
      console.log('selected seat number:', this.selectedSeatNumber);
      console.log('selected seat vagon id:', this.selectedSeatVagonId);
      this.selectedSeatPrice[this.selectedPassengerIndex] = this.selectedSeat.price;
      console.log('selected seat price:', this.selectedSeatPrice);
      this.seatVagonId = this.selectedSeat.vagonId;
      console.log('selected vagon id:', this.seatVagonId);

      if(this.selectedPassengerIndex !== null && this.selectedPassengerIndex !== undefined){
        if(this.selectedSeatIds.has(this.selectedPassengerIndex)){
          this.existingSeatId = this.selectedSeatIds.get(this.selectedPassengerIndex);
          console.log('existing seat id:', this.existingSeatId);

          if(this.existingSeatId){
            this.previousWagon = this.getFullWagonList.find((wagon:any)=>{
              return wagon.seats.some((seat:any)=>seat.seatId === this.existingSeatId);
            });
            console.log('previous wagon:',this.previousWagon);
            console.log('previous wagon seats:',this.previousWagon.seats);

            if(this.previousWagon){
              this.previousSeat = this.previousWagon.seats.find((seat:any) => {
                return seat.seatId === this.existingSeatId;
              })
              console.log('previous seat:', this.previousSeat);

              if(this.previousSeat){
                this.totalPrice -= this.previousSeat.price;
                console.log('total price:', this.totalPrice);
              }
            }
          }
        }

        const passengers = this.formPersonalInfo.get('people') as FormArray;
        const passenger = passengers.at(this.selectedPassengerIndex) as FormGroup; 

        passenger.get('seatId')?.setValue(this.selectedSeat.seatId);

        this.selectedSeatIds.set(
          this.selectedPassengerIndex, this.selectedSeat.seatId
        );
        this.totalPrice += this.selectedSeat.price;
        console.log('end total price:', this.totalPrice);

      }
    }

    this.showPopup = false;
  }

  isSeatTaken(seatNumber: string, vagonId: number): boolean {
    return this.selectedSeatNumber.some((seatNum, index) => index !== this.selectedPassengerIndex && seatNum === seatNumber && this.selectedSeatVagonId[index] === vagonId);
  }

  showPayment(){
    this.showPaymentPopup = !this.showPaymentPopup;
  }

  preventClose(event:Event){
    event.stopPropagation()
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event:Event){
    if(this.showPopup){
      let clickedInside = (event.target as HTMLElement).closest(".popup-card");
      if(!clickedInside){
        this.showPopup = !this.showPopup;
        console.log("click outside", this.showPopup)
      }
    }

    if(this.showPaymentPopup){
      let clickedInside = (event.target as HTMLElement).closest(".popup-card");
      if(!clickedInside){
        this.showPaymentPopup = !this.showPaymentPopup;
      }
    }
  }

  closePopup(){
    this.showPopup = false;
    this.showPaymentPopup = false;
  }
  

  onSubmit(){
    this.http.post("https://railway.stepprojects.ge/api/tickets/register", this.formPersonalInfo.value, {responseType: 'text'})
    .subscribe((response) => {
      try{
        console.log(response)

        const splitResponse = response.split(':');
        this.trueIdSaver = splitResponse[1]?.trim();
        console.log(this.trueIdSaver);

        this.router.navigate(['/დადასტურება'], {
          state: {
            trueTktId: this.trueIdSaver,
            paymentInfo: this.paymentForm.value,
            tktBoughtOn: new Date().toISOString()
          }
        })

      }catch(error){
        console.error("response error:", error)
      }
    })

    this.showPaymentPopup = false;
  }

  checkCheckbox(event:Event){
    event.stopPropagation();
    this.invoiceCheckbox = !this.invoiceCheckbox;
  }

  

  getConsole(formPersonalInfo:any){
    console.log(formPersonalInfo.value)
  }

  getConsolePay(paymentForm:any){
    console.log(paymentForm.value)
  }
}
