import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

export interface Material {
  id?: string;
  name: string;
  version: string;
  ref: string;
  photo?: string;
  phoneNumber?: string;
  borrowerId?: string;
  startDate?: Date;
  endDate?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private collectionName = 'materials';

  constructor(private firestore: AngularFirestore) {}

  // Récupérer tous les matériels
  getMaterials(): Observable<Material[]> {
    return this.firestore.collection<Material>(this.collectionName).valueChanges({ idField: 'id' });
  }

  // Ajouter un matériel
  addMaterial(material: Material): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore.collection<Material>(this.collectionName).doc(id).set(material);
  }

  // Modifier un matériel
  updateMaterial(id: string, material: Partial<Material>): Promise<void> {
    return this.firestore.collection<Material>(this.collectionName).doc(id).update(material);
  }

  // Supprimer un matériel
  deleteMaterial(id: string): Promise<void> {
    return this.firestore.collection<Material>(this.collectionName).doc(id).delete();
  }
}
