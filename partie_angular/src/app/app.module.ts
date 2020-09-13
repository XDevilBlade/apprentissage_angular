import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LecteurAudioComponent } from './lecteur-audio/lecteur-audio.component';
import { AccueilComponent } from './accueil/accueil.component';
import { FormsModule }   from '@angular/forms';
import { DownloadMusicComponent } from './download-music/download-music.component';
import { UploadMusicComponent } from './upload-music/upload-music.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LecteurAudioComponent,
    AccueilComponent,
    DownloadMusicComponent,
    UploadMusicComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
