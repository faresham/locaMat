import { Component, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import {Router} from '@angular/router';  // Importer votre service d'authentification

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>(); // Événement pour basculer l'état de la sidebar
  userDetails: any; // Pour stocker les informations de l'utilisateur connecté

  constructor(private authService: AuthService, private router: Router) {
    // Récupérer les détails de l'utilisateur connecté
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.authService.getUserDetails(user.uid).subscribe(details => {
          this.userDetails = details; // On récupère et stocke les informations de l'utilisateur
        });
      }
    });
  }

  // Fonction de déconnexion
  logout() {
    this.authService.signOut().then(() => {
      console.log('Utilisateur déconnecté');
      this.router.navigate(['/login']);
      // Vous pouvez rediriger vers la page de connexion ici, si besoin
    });
  }

  // Fonction vide pour voir le profil (à implémenter plus tard)
  viewProfile() {
    console.log('Voir le profil');
    // Logique à implémenter plus tard pour afficher le profil
  }
}
