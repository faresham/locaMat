import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {Observable, of, switchMap} from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../user/user.service'; // Assurez-vous d'avoir un modèle `User`

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth, // Service d'authentification Firebase
    private firestore: AngularFirestore // Service Firestore pour récupérer les données utilisateur
  ) {}

  // 1. Récupérer l'utilisateur connecté
  // Cette fonction retourne l'état de l'authentification de l'utilisateur (connecté ou déconnecté)
  getCurrentUser(): Observable<any> {
    return this.afAuth.authState;
  }

  // 2. Connexion avec email et mot de passe
  // Permet à un utilisateur de se connecter avec un email et un mot de passe
  signIn(email: string, password: string): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  // 3. Déconnexion de l'utilisateur
  // Permet à l'utilisateur de se déconnecter de l'application
  signOut(): Promise<void> {
    return this.afAuth.signOut();
  }

  // 4. Récupérer les informations de l'utilisateur depuis Firestore
  // Cette fonction récupère les informations de l'utilisateur depuis Firestore (par exemple, son rôle)
  getUserDetails(uid: string): Observable<User | undefined> {
    return this.firestore.collection('users').doc<User>(uid).valueChanges();
  }

  // 5. Inscription d'un nouvel utilisateur
  // Créer un nouvel utilisateur avec email, mot de passe et nom d'affichage
  signUp(email: string, password: string, displayName: string): Promise<any> {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user) {
          return user.updateProfile({ displayName }).then(() => user); // Retourne l'utilisateur créé
        }
        throw new Error('Erreur lors de la création de l\'utilisateur');
      });
  }

  // 6. Vérifier si l'utilisateur a un rôle d'admin
  // Vérifie si l'utilisateur connecté a un rôle d'administrateur
  isAdmin(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user && user.uid) {
          return this.firestore.collection('users').doc<User>(user.uid).valueChanges().pipe(
            map((userData) => userData?.isAdmin || false) // Vérifie directement si isAdmin est vrai
          );
        }
        return of(false); // Retourne false si aucun utilisateur connecté
      })
    );
  }
}
