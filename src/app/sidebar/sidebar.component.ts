import { Component, Input } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() isSidebarOpen: boolean = true; // L'état de la sidebar (ouverte ou fermée)
  isAdmin: boolean = false; // Variable pour vérifier si l'utilisateur est admin

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Vérifier si l'utilisateur est un administrateur
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.authService.isAdmin(user.uid).subscribe(isAdmin => {
          this.isAdmin = isAdmin; // Mettre à jour l'état de l'utilisateur (admin ou non)
        });
      }
    });
  }
}
