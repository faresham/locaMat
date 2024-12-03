import { Injectable } from '@angular/core';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /*private auth = getAuth();  // Crée une instance de l'authentification

  constructor() {}

  // Retourne un observable de l'utilisateur connecté
  getCurrentUser(): Observable<User | null> {
    return new Observable((observer) => {
      onAuthStateChanged(this.auth, (user) => {
        observer.next(user);  // Si un utilisateur est connecté, on l'envoie
      });
    });
  }

  // Connexion avec email et mot de passe
  signIn(email: string, password: string): Promise<User> {
    return signInWithEmailAndPassword(this.auth, email, password).then((userCredential) => {
      return userCredential.user;
    });
  }

  // Déconnexion
  signOut(): Promise<void> {
    return signOut(this.auth);
  }*/
}
