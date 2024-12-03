import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'Administrateur' | 'Emprunteur';
  matricule: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private collectionName = 'users';

  constructor(private firestore: AngularFirestore) {}

  // Récupérer tous les utilisateurs
  getUsers(): Observable<User[]> {
    return this.firestore.collection<User>(this.collectionName).valueChanges({ idField: 'id' });
  }

  // Ajouter un utilisateur
  addUser(user: User): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore.collection<User>(this.collectionName).doc(id).set(user);
  }

  // Modifier un utilisateur
  updateUser(id: string, user: Partial<User>): Promise<void> {
    return this.firestore.collection<User>(this.collectionName).doc(id).update(user);
  }

  // Supprimer un utilisateur
  deleteUser(id: string): Promise<void> {
    return this.firestore.collection<User>(this.collectionName).doc(id).delete();
  }
}
