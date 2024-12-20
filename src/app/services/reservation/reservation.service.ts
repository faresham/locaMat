import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

export interface Reservation {
  id?: string;
  borrowStartDate: Date;
  borrowEndDate: Date;
  createdAt: Date;
  updatedAt: Date;
  user: string;
  deviceId: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private collectionName = 'reservations';

  constructor(private firestore: AngularFirestore) {}

  // Récupérer toutes les réservations
  getReservations(): Observable<Reservation[]> {
    return this.firestore
      .collection<Reservation>(this.collectionName)
      .valueChanges({ idField: 'id' });
  }

  // Ajouter une réservation
  addReservation(reservation: Reservation): Promise<void> {
    const id = this.firestore.createId(); // Générer un nouvel ID Firestore
    return this.firestore
      .collection<Reservation>(this.collectionName)
      .doc(id)
      .set({
        ...reservation,
        createdAt: new Date(), // Ajouter l'horodatage
        updatedAt: new Date(),
      });
  }

  // Récupérer les réservations d'un appareil spécifique
  getReservationsByDeviceId(deviceId: string): Observable<Reservation[]> {
    return this.firestore
      .collection<Reservation>(this.collectionName, (ref) =>
        ref.where('deviceId', '==', deviceId)
      )
      .valueChanges({ idField: 'id' });
  }
}
