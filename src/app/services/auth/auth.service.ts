import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
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
  // Cette fonction vérifie dans Firestore si l'utilisateur a un rôle 'admin'
  isAdmin(uid: string): Observable<boolean> {
    // Implémentation pour vérifier si un utilisateur est administrateur
    return this.firestore
      .collection('users') // Supposez que vous avez une collection 'users'
      .doc(uid)
      .valueChanges()
      .pipe(
        map((user: any) => user?.role === 'administrateur') // Vérifiez si le rôle est 'admin'
      );
  }
  getCurrentUserUid(): string | null {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.uid || null;
  }
  
  }
  
