import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';  // Pour l'authentification
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';  // Pour Firestore
import { environment } from '../environments/environment';  // Assure-toi que tu importes tes infos Firebase

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),  // Initialisation de Firebase
    AngularFireAuthModule,  // Pour l'authentification
    AngularFirestoreModule  // Pour Firestore
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
