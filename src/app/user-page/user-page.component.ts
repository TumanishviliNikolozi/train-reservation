import { Component, OnInit } from '@angular/core';
import { SignUpInService } from '../services/sign-up-in.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-user-page',
  imports: [],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss'
})
export class UserPageComponent implements OnInit {

  constructor(private everrest:SignUpInService){

  }

  private bothTokens:any;
  private accessToken:any;
  private refreshToken:any;

  private getCurrentUser:any;

  private refreshSubscription!: Subscription;


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

  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

}
