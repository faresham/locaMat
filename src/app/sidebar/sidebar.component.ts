import {Component, Input} from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  @Input() isSidebarOpen: boolean = true; // Reçoit la valeur depuis le composant parent
  isAdmin: boolean = false; // Indique si l'utilisateur est admin
  isAdminMenuOpen: boolean = false; // Contrôle de l'ouverture du sous-menu admin

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Vérifie si l'utilisateur est admin via le service AuthService
    this.authService.isAdmin().subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    });
  }

  // Méthode pour ouvrir/fermer le sous-menu admin
  toggleAdminMenu(): void {
    this.isAdminMenuOpen = !this.isAdminMenuOpen;
  }
}
