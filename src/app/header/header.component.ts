import { Component, ElementRef, HostListener, signal, viewChild } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(){

  }

  public RegisterPopup:boolean = false;
  public isScrolled:boolean = false;

  @HostListener('window:scroll', [])

  onWindowScroll(){
    this.isScrolled = window.scrollY > 50;
  }

  aboutMeDrop = viewChild<ElementRef>('aboutMeDrop');
  isDropActive = signal(false);

  showAboutMe(){
    this.isDropActive.update((value) => !value)
  }

  @HostListener('document:click', ['$event'])

  handleOutsideClick(event:Event){
    const aboutMeDropdownContainer = this.aboutMeDrop();

    const aboutMeClickedInside = aboutMeDropdownContainer?.nativeElement.contains(event.target);

    if(!aboutMeClickedInside){
      this.isDropActive.set(false);
    }

    if(this.RegisterPopup){
      let clickedInside = (event.target as HTMLElement).closest(".register-popup-card");
      if(!clickedInside){
        this.RegisterPopup = !this.RegisterPopup;
        console.log("click outside", this.RegisterPopup)
      }
    }
  }

  showRegisterPopuo(){
    this.RegisterPopup = !this.RegisterPopup;
  }

  closePopup(){
    this.RegisterPopup = false;
  }
}
