import { Component, ElementRef, HostListener, signal, viewChild } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  aboutMeDrop = viewChild<ElementRef>('aboutMeDrop');
  isDropActive = signal(false);

  showAboutMe(){
    this.isDropActive.update((value) => !value)
  }

  @HostListener('document:click', ['$event'])

  handleOutsideClick(event: MouseEvent){
    const aboutMeDropdownContainer = this.aboutMeDrop();

    const aboutMeClickedInside = aboutMeDropdownContainer?.nativeElement.contains(event.target);

    if(!aboutMeClickedInside){
      this.isDropActive.set(false);
    }
  }

  @HostListener('click', ['$event'])
  preventClose(event: Event) {
    event.stopPropagation();
  }
}
