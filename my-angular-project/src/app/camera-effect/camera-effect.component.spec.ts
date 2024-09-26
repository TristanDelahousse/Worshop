import { Component, HostListener } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-camera-effect',
  templateUrl: './camera-effect.component.html',
  styleUrls: ['./camera-effect.component.scss'],
  animations: [
    trigger('scrollEffect', [
      state('start', style({
        transform: 'translateZ(0)'
      })),
      state('end', style({
        transform: 'translateZ(-300px) rotateX(30deg)'
      })),
      transition('start => end', animate('500ms ease-out')),
      transition('end => start', animate('500ms ease-in'))
    ])
  ]
})
export class CameraEffectComponent {
  scrollPosition = 'start';

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const scrollY = window.scrollY;
    this.scrollPosition = scrollY > 200 ? 'end' : 'start';
  }
}
