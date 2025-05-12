import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { APIsService } from '../services/apis.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { WeekDay } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-trains',
  imports: [TranslateModule],
  templateUrl: './trains.component.html',
  styleUrl: './trains.component.scss'
})
export class TrainsComponent implements OnInit{
  constructor(private router:Router, private route:ActivatedRoute, private api:HttpClient, private translate:TranslateService){
    translate.setDefaultLang('ka');
    translate.use('ka');
  }

  public whereFrom!:string;
  public destination!:string;
  public date!:string;
  public passengers!:number;

  public trains:any[] = [];

  public ifEmptyTrains:boolean = false;

  ngOnInit(){
    this.route.queryParams.subscribe(params => {
      if(params){
        this.whereFrom = params['whereFrom'] || "";
        this.destination = params['destination'] || "";
        this.date = params['date'] || "";
        this.fetchTrains();
      }
      
      // console.log(this.whereFrom)
      // console.log(this.destination)
      // console.log('Oninit',this.date)
      
    })

    const newParams = this.route.snapshot.queryParams;
    this.passengers = +(newParams['passengers']);

    // console.log(this.passengers)
    // console.log(typeof(this.passengers))
  }


  // -------------------- train filter --------------------------

  fetchTrains(){
    const trainLink = 'https://railway.stepprojects.ge/api/departures';
    let params = new HttpParams()
    .set('source', this.whereFrom)
    .set('destination', this.destination)
    .set('date', this.date);
    // console.log('Date:', this.date)

    this.api.get<any[]>(trainLink, {params}).subscribe((response:any[]) => {
      // console.log("ApiResponse", response);
      const wantedWeekDay = this.weekDayTransformer(this.date)
      this.trains = response.filter(train => {
        return (
          train.source === this.whereFrom &&
          train.destination === this.destination &&
          train.date === wantedWeekDay
        );
      })?.[0]?.trains || []
      // console.log(this.trains);

      if(this.trains.length === 0){
        this.ifEmptyTrains = true;
      }
    },
    (error) => {
      console.error("TrainsError:", error)
    }
  )

  }

  weekDayTransformer(chosenDate:string){
    const weekDays = ['კვირა', 'ორშაბათი', 'სამშაბათი', 'ოთხშაბათი', 'ხუთშაბათი', 'პარასკევი', 'შაბათი'];
    const holeDate = new Date(chosenDate);
    const weekDay = weekDays[holeDate.getDay()];
    // console.log(weekDay)
    // console.log(typeof(weekDay))
    return weekDay
  }



  // ----------------- info to reservation ------------------

  chosenTrainInfo(trainInfo:any){
    this.router.navigate(['/მგზავრთა მონაცემები'], {
      state:{
        trainInfo: trainInfo,
        rawDate: this.date,
        passengers: this.passengers
      }
    })
  }
  
}
