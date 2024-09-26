import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'votre-application';

  @HostListener('window:scroll', [])
  onWindowScroll() {
    console.log('Scroll détecté dans AppComponent !', window.scrollY);
  }
}
