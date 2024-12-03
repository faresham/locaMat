import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service'; // Assure-toi d'importer ton service d'authentification
import { User } from 'firebase/auth';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  user: User | null = null; // Initialisation avec null

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Souscrire à l'observable pour récupérer l'utilisateur connecté
    /*this.authService.getCurrentUser().subscribe((data) => {
      this.user = data;  // L'utilisateur peut être null si personne n'est connecté
    });*/
  }
  // Méthode de déconnexion
  logout(): void {
  /*
    this.authService.signOut().then(() => {
      console.log('Utilisateur déconnecté');
      this.user = null;  // Réinitialiser user à null après la déconnexion
    }).catch((error) => {
      console.error('Erreur de déconnexion:', error);
    });
   */
  }

  // Méthode de redirection vers la page de connexion (si nécessaire)
  goToLogin(): void {
  /*
    console.log('Naviguer vers la page de connexion');
    // Ici, tu pourrais naviguer vers une page de login, par exemple :
    // this.router.navigate(['/login']);
   */
  }
}
