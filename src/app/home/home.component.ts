import {Component, OnInit} from '@angular/core';
import {UserService} from '../services/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  constructor(public userService: UserService) { }

  ngOnInit(): void {
    // Souscrire à l'observable pour récupérer l'utilisateur connecté
    this.userService.getUsers().subscribe((data) => {
      console.log(data);
    });
  }
}
