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
import { HomeComponent } from './home/home.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from './header/header.component';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [AppComponent, AuthComponent, HomeComponent, HeaderComponent],
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig),  // Initialisation de Firebase
    AngularFireAuthModule,  // Pour l'authentification
    AngularFirestoreModule,
    RouterModule,
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatToolbar,
    MatIconModule,
    // Pour Firestore
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
