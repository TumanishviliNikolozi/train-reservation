import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { SignUpInService } from '../services/sign-up-in.service';
import { interval, Subscription } from 'rxjs';
import { Event } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-page',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss'
})
export class UserPageComponent implements OnInit, OnDestroy {

  constructor(private everrest:SignUpInService){

  }

  private bothTokens:any;
  private accessToken:any;
  private refreshToken:any;

  public getCurrentUser:any;

  private refreshSubscription!: Subscription;

  public passwordCheckBox:Boolean = false;

  public changePasswordForm!: FormGroup;


  ngOnInit(): void {
    this.bothTokens = localStorage.getItem('accessToken');

    if(this.bothTokens){
      this.bothTokens = JSON.parse(this.bothTokens);
      this.accessToken = this.bothTokens.access_token;
      this.refreshToken = this.bothTokens.refresh_token;
      console.log('both token:', this.bothTokens);
      console.log('access token:', this.accessToken);
      console.log('refresh token:', this.refreshToken);
    }

    if(this.accessToken && this.refreshToken){
      this.getUser();
      this.startAutoRefresh(8 * 60 * 1000);
    }

    this.changePasswordForm = new FormGroup({
      oldPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required])
    })
  }

  getUser(){
    this.everrest.getEverrestCurrentUser(this.accessToken).subscribe((response) => {
      this.getCurrentUser = response;
      console.log('current user:', this.getCurrentUser);
    })
  }

  startAutoRefresh(refreshIntervalMs: number) {
    this.refreshSubscription = interval(refreshIntervalMs).subscribe(() => {
      this.refreshTokenCall();
    });
  }

  refreshTokenCall() {
    this.everrest.refreshEverrestToken(this.refreshToken).subscribe((response: any) => {
      console.log('Refreshed token:', response);

      this.accessToken = response.access_token;
      this.refreshToken = response.refresh_token;
      this.bothTokens = response;

      localStorage.setItem('accessToken', JSON.stringify(response));
    });
  }

  


  checkCheckbox(event:MouseEvent){
    event.stopPropagation();
    this.passwordCheckBox = !this.passwordCheckBox;
  }

  changePassword(){
    this.everrest.changeEverrestPassword(this.changePasswordForm.value).subscribe((response) => {
      console.log('changed accessToken:', response)
      localStorage.setItem('accessToken', JSON.stringify(response));
    })
  }

  leaveAccount(){
    localStorage.removeItem('accessToken');
    location.reload();
  }

  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

}
