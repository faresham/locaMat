import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';  // Import de AngularFireAuth pour l'authentification
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  // Fonction pour se connecter avec email et mot de passe
  async login() {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(this.email, this.password);
      console.log('Connexion réussie', userCredential);
      this.router.navigate(['/home']);
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }

  // Fonction pour s'inscrire avec email et mot de passe
  async signUp() {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(this.email, this.password);
      console.log('Inscription réussie', userCredential);
      this.router.navigate(['/home']); // Rediriger vers le tableau de bord après l'inscription
    } catch (error: any) {
      this.errorMessage = error.message;  // Afficher l'erreur si l'inscription échoue
    }
  }

  // Fonction pour se déconnecter
  async logout() {
    try {
      await this.afAuth.signOut();
      console.log('Déconnexion réussie');
      this.router.navigate(['/login']); // Rediriger vers la page de login après déconnexion
    } catch (error) {
      console.error('Erreur de déconnexion', error);
    }
  }
}
