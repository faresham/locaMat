import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

export interface Reservation {
  borrowStartDate: Date;
  borrowEndDate: Date;
  createdAt: Date;
  updatedAt: Date;
  user: string;
  deviceId: string; // L'ID de l'appareil
}

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private collectionName = 'borrowedItem';

  constructor(private firestore: AngularFirestore) {}

  // Récupérer toutes les réservations
  getReservations(): Observable<Reservation[]> {
    return this.firestore
      .collection<Reservation>(this.collectionName)
      .valueChanges();
  }

  // Ajouter une réservation
  addReservation(reservation: Omit<Reservation, 'id'>): Promise<void> {
    const id = this.firestore.createId(); // Générer un nouvel ID
    const reservationWithId = {
      ...reservation,
    };
    return this.firestore
      .collection<Reservation>(this.collectionName)
      .doc(id)
      .set(reservationWithId);
  }
}
