import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'LocaMat';
  isSidebarOpen: boolean = true; // Par défaut, la sidebar est ouverte

  constructor(private router: Router) {}

  // Vérifier si l'utilisateur est sur la page de connexion
  isLoginPage(): boolean {
    return this.router.url === '/login' || this.router.url === '/';
  }

  // Basculer l'état de la sidebar
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
