import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LecteurAudioComponent } from './lecteur-audio/lecteur-audio.component';
import { AccueilComponent } from './accueil/accueil.component';
import { UploadMusicComponent } from './upload-music/upload-music.component';
import { DownloadMusicComponent } from './download-music/download-music.component';


const routes: Routes = [
  {path : '', component: AccueilComponent},
  {path: 'lecteur_audio', component: LecteurAudioComponent},
  {path: 'upload_audio', component: UploadMusicComponent},
  {path: 'download_audio', component: DownloadMusicComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
