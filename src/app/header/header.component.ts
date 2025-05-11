import { Component, ElementRef, HostListener, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { Form, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { SignUpInService } from '../services/sign-up-in.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {

  constructor(private everrest:SignUpInService, private router:Router, private route:ActivatedRoute){

  }

  public RegisterPopup:boolean = false;
  public isScrolled:boolean = false;
  public iAmRegistered:boolean = true;

  public signUpForm!:FormGroup;
  public signInForm!:FormGroup;
  public verifyEmailForm!:FormGroup;

  public genderHolder:string[] = ['MALE', "FEMALE", 'OTHER'];
  public chosenGender:string = '';


  ngOnInit(): void {
    this.signUpForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      age: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
      zipcode: new FormControl('', [Validators.required]),
      avatar: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
    })

    this.signInForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    })

    this.verifyEmailForm = new FormGroup({
      email: new FormControl('', [Validators.required])
    })
  }

  submitSignUp(){
    console.log('sign up form:', this.signUpForm.value);

    this.everrest.everrestSignUp(this.signUpForm.value).subscribe((response) => {
      localStorage.setItem('registerResponse', JSON.stringify(response));
      // console.log('registerResponse', response);
    })
  }

  submitSignIn(){
    console.log('sign in form:', this.signInForm.value);

    this.everrest.everrestSignIn(this.signInForm.value).subscribe((response) => {
      localStorage.setItem('accessToken', JSON.stringify(response));

      setTimeout(() => {
        this.closePopup();
      }, 1000);

      setTimeout(() => {
        location.reload()
      }, 2000);
      // console.log('accessToken', response);
    })
  }

  verifyEmail(){
    console.log('verify email:', this.verifyEmailForm.value);

    this.everrest.everrestVerification(this.verifyEmailForm.value).subscribe((response) => {
      localStorage.setItem('verificationInfo', JSON.stringify(response));
      // console.log('verificationInfo', response);
    })
  }

  getGender(myGender:string){
    this.chosenGender = myGender;
    this.signUpForm.get('gender')?.setValue(this.chosenGender);
    // console.log('mygender:', myGender);
    // console.log('chosen gender:', this.chosenGender);
  }


  @HostListener('window:scroll', [])

  onWindowScroll(){
    this.isScrolled = window.scrollY > 50;
  }

  genderDropdown = viewChild<ElementRef>('genderlist');
  seeGenderList = signal(false);

  toggleGenderClass(){
    this.seeGenderList.update((value) => !value);
  }

  aboutMeDrop = viewChild<ElementRef>('aboutMeDrop');
  isDropActive = signal(false);

  showAboutMe(){
    this.isDropActive.update((value) => !value);
  }

  @HostListener('document:click', ['$event'])

  handleOutsideClick(event:Event){
    const aboutMeDropdownContainer = this.aboutMeDrop();
    const genderDropdownContainer = this.genderDropdown();

    const aboutMeClickedInside = aboutMeDropdownContainer?.nativeElement.contains(event.target);
    const genderDropdownClickedInside = genderDropdownContainer?.nativeElement.contains(event.target);

    if(!aboutMeClickedInside){
      this.isDropActive.set(false);
      // console.log(this.isDropActive());
    }

    if(!genderDropdownClickedInside){
      this.seeGenderList.set(false);
      // console.log(this.seeGenderList());
    }

    if(this.RegisterPopup){
      let clickedInside = (event.target as HTMLElement).closest(".register-popup-card");
      if(!clickedInside){
        this.RegisterPopup = !this.RegisterPopup;
        console.log("click outside", this.RegisterPopup)
      }
    }
  }

  showRegisterPopup(){
    this.RegisterPopup = !this.RegisterPopup;
  }

  closePopup(){
    this.RegisterPopup = false;
  }

  areYouRegistered(){
    this.iAmRegistered = !this.iAmRegistered;
  }

  goToUserPage(){
    this.router.navigate(['/მომხმარებლის გვერდი']);
  }

  showStorage(){
    let saved = localStorage.getItem('registerResponse')

    if (saved) {
      console.log(JSON.parse(saved));
    } else {
      console.log('No registerResponse found in storage.');
    }
  }

  showtokenStorage(){
    let tokenSaved = localStorage.getItem('accessToken')

    if (tokenSaved) {
      console.log(JSON.parse(tokenSaved));
    } else {
      console.log('No accessToken found in storage.');
    }
  }

  ngOnDestroy(): void {
    
  }

  

  // gotoerror(){
  //   this.router.navigate(['/error'])
  // }
}
