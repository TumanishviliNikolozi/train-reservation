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
        'accept': '*/*',
        'Content-Type': 'application/json'
      }
    });
  }

  everrestSignIn(signInForm:any){
    return this.signUpOrIn.post('https://api.everrest.educata.dev/auth/sign_in', signInForm, {
      headers:{
        'accept': '*/*',
        'Content-Type': 'application/json'
      }
    });
  }

  everrestVerification(verifyEmailForm:any){
    return this.signUpOrIn.post('https://api.everrest.educata.dev/auth/verify_email', verifyEmailForm, {
      headers:{
        'accept': '*/*',
        'Content-Type': 'application/json'
      }
    })
  }

  refreshEverrestToken(refreshToken: string) {
    return this.signUpOrIn.post('https://api.everrest.educata.dev/auth/refresh', {
      refresh_token: refreshToken
    }, {
      headers: {
        'accept': '*/*'
      }
    });
  }

  changeEverrestPassword(changePasswordForm:any){
    return this.signUpOrIn.patch('https://api.everrest.educata.dev/auth/change_password', changePasswordForm, {
      headers:{
        'accept': '*/*',
        'Content-Type': 'application/json'
      }
    })
  }

  getEverrestCurrentUser(accessToken:string){
    return this.signUpOrIn.get('https://api.everrest.educata.dev/auth', {
      headers:{
        'accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    })
  }
}
