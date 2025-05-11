import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SignUpInService {

  constructor(public signUpOrIn:HttpClient) { }

  everrestSignUp(signUpForm:any){
    return this.signUpOrIn.post('https://api.everrest.educata.dev/auth/sign_up', signUpForm, {
      headers:{
        'accept' : '*/*',
        'Content-Type' : 'application/json'
      }
    });
  }

  everrestSignIn(signInForm:any){
    return this.signUpOrIn.post('https://api.everrest.educata.dev/auth/sign_in', signInForm, {
      headers:{
        'accept' : '*/*',
        'Content-Type' : 'application/json'
      }
    });
  }
}
