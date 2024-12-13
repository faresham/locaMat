import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';  // Ajout d'une propriété pour stocker les messages d'erreur

  constructor(private auth: AuthService, private router: Router) {}

  // Fonction pour se connecter avec email et mot de passe
  async login() {
    this.errorMessage = '';  // Réinitialiser le message d'erreur avant chaque tentative
    try {
      const userCredential = await this.auth.signIn(this.email, this.password);
      if (userCredential) {
        this.router.navigate(['/home']);
      }
    } catch (error: any) {
      // En cas d'erreur, afficher un message approprié
      this.errorMessage = error.message || 'Une erreur est survenue lors de la connexion.';
    }
  }

  // Fonction pour se déconnecter
  async logout() {
    try {
      await this.auth.signOut();
      this.router.navigate(['/login']);
    } catch (error: any) {
      // Gérer une erreur lors de la déconnexion si nécessaire
      this.errorMessage = 'Une erreur est survenue lors de la déconnexion.';
    }
  }
}
