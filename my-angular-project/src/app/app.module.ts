import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { CameraEffectComponent } from './camera-effect/camera-effect.component';

@NgModule({
  declarations: [
    AppComponent,
    CameraEffectComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
