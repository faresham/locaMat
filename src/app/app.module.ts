import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';  // Pour l'authentification
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';  // Pour Firestore
import { environment } from '../environments/environment';  // Assure-toi que tu importes tes infos Firebase

import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, AuthComponent],
  imports: [
    RouterModule,
    AppRoutingModule,
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),  // Initialisation de Firebase
    AngularFireAuthModule,  // Pour l'authentification
    AngularFirestoreModule,
    FormsModule,
    // Pour Firestore
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
