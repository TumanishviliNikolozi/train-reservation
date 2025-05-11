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

  getTrainsById(trainId:any){
    return this.apis.get(`https://railway.stepprojects.ge/api/trains/${trainId}`);
  }

  getAllVagons(){
    return this.apis.get("https://railway.stepprojects.ge/api/vagons");
  }

  getVagonsById(vagonId:number){
    return this.apis.get(`https://railway.stepprojects.ge/api/getvagon/${vagonId}`);
  }

  getAllDepartures(){
    return this.apis.get("https://railway.stepprojects.ge/api/departures");
  }

  getDepartureById(from:string, to:string, date:any){
    return this.apis.get(`https://railway.stepprojects.ge/api/getdeparture?from=${from}&to=${to}&date=${date}`)
  }

  getAllTickets(){
    return this.apis.get("https://railway.stepprojects.ge/api/tickets");
  }

  // postTicketRegister(formValue:any){
  //   return this.apis.post("https://railway.stepprojects.ge/api/tickets/register", formValue)
  // }

  getTicketCheckStatusById(tktId:string){
    return this.apis.get(`https://railway.stepprojects.ge/api/tickets/checkstatus/${tktId}`);
  }

  getTicketConfirmedById(){
    // return this.apis.get(`https://railway.stepprojects.ge/api/tickets/confirm/${}`);
  }

  deleteTicketById(tktId:string){
    return this.apis.delete(`https://railway.stepprojects.ge/api/tickets/cancel/${tktId}`, {responseType: 'text'});
  }
}
