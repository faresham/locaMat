import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../services/user/user.service';
import { AuthService } from '../services/auth/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent implements OnInit {
  users$: Observable<User[]>;
  displayedUsers: User[] = [];
  searchTerm: string = '';
  isAdmin: boolean = false;
  loading: boolean = true;

  dialogUser: User = {
    id: '',
    prenom: '',
    nom: '',
    email: '',
    isAdmin: false,
    matricule: '',
  };
  dialogPassword: string = ''; // Ajout du champ mot de passe
  isDialogOpen = false;
  isEditing = false;

  constructor(private userService: UserService, private authService: AuthService) {
    this.users$ = this.userService.getUsers();
  }

  ngOnInit(): void {
    this.authService.isAdmin().subscribe((isAdmin) => (this.isAdmin = isAdmin));
    this.users$.subscribe((users) => {
      this.displayedUsers = users;
      this.loading = false;
    });
  }

  filterUsers(): void {
    this.users$.subscribe((users) => {
      this.displayedUsers = users.filter(
        (user) =>
          user.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          user.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filterUsers();
  }

  deleteUser(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.userService.deleteUser(id).subscribe(() => this.filterUsers());
    }
  }

  openDialog(user?: User): void {
    this.isDialogOpen = true;
    this.isEditing = !!user;
    this.dialogUser = user
      ? { ...user }
      : { id: '', prenom: '', nom: '', email: '', isAdmin: false, matricule: '' };
    this.dialogPassword = ''; // Réinitialiser le mot de passe
  }

  saveDialogUser(): void {
    if (this.isEditing) {
      this.userService.updateUser(this.dialogUser.id, this.dialogUser).subscribe(() => this.closeDialog());
    } else {
      this.authService
        .signUp(this.dialogUser.email, this.dialogPassword, `${this.dialogUser.prenom} ${this.dialogUser.nom}`)
        .then(() => this.userService.addUser(this.dialogUser).subscribe(() => this.closeDialog()))
        .catch((error) => console.error('Erreur lors de la création de l\'utilisateur :', error));
    }
  }

  closeDialog(): void {
    this.isDialogOpen = false;
    this.dialogUser = { id: '', prenom: '', nom: '', email: '', isAdmin: false, matricule: '' };
    this.dialogPassword = '';
    this.isEditing = false;
  }
}
