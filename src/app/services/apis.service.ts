import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class APIsService {

  constructor(public apis:HttpClient) { }

  getAllStations(){
    return this.apis.get("https://railway.stepprojects.ge/api/stations");
  }

  getAllTrains(){
    return this.apis.get("https://railway.stepprojects.ge/api/trains");
  }

  getTrainsById(){
    // return this.apis.get(`https://railway.stepprojects.ge/api/trains/${}`);
  }

  getAllVagons(){
    return this.apis.get("https://railway.stepprojects.ge/api/vagons");
  }

  getVagonsById(){
    // return this.apis.get(`https://railway.stepprojects.ge/api/getvagon/${}`);
  }

  getAllDepartures(){
    return this.apis.get("https://railway.stepprojects.ge/api/departures");
  }

  getAllTickets(){
    return this.apis.get("https://railway.stepprojects.ge/api/tickets");
  }

  // postTicketRegister():void{
  //   this.apis.post(
  //     "https://railway.stepprojects.ge/api/tickets/register",
  //     null
  //   )
  // }

  getTicketCheckStatusById(){
    // return this.apis.get(`https://railway.stepprojects.ge/api/tickets/checkstatus/${}`);
  }

  getTicketConfirmedById(){
    // return this.apis.get(`https://railway.stepprojects.ge/api/tickets/confirm/${}`);
  }
}
