import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../services/user/user.service';
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

  dialogUser: User = {
    id: '',
    prenom: '',
    nom: '',
    email: '',
    isAdmin: false,
    matricule: '',
  };
  isDialogOpen = false;
  isEditing = false;

  constructor(private userService: UserService) {
    this.users$ = this.userService.getUsers();
  }

  ngOnInit(): void {
    this.users$.subscribe((users) => (this.displayedUsers = users));
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

  deleteUser(id: string): void {
    this.userService.deleteUser(id).subscribe();
  }

  openDialog(user?: User): void {
    this.isDialogOpen = true;
    this.isEditing = !!user;
    this.dialogUser = user
      ? { ...user }
      : { id: '', prenom: '', nom: '', email: '', isAdmin: false, matricule: '' };
  }

  saveDialogUser(): void {
    if (this.isEditing) {
      this.userService.updateUser(this.dialogUser.id, this.dialogUser).subscribe(() => this.closeDialog());
    } else {
      this.userService.addUser(this.dialogUser).subscribe(() => this.closeDialog());
    }
  }

  closeDialog(): void {
    this.isDialogOpen = false;
    this.dialogUser = { id: '', prenom: '', nom: '', email: '', isAdmin: false, matricule: '' };
    this.isEditing = false;
  }
}
