import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Reservation {
  id?: string; // L'ID est généré automatiquement par Firestore
  borrowStartDate: Date; // Type Date pour l'application
  borrowEndDate: Date;
  user: string; // UID de l'utilisateur
  deviceId: string; // ID de l'appareil réservé
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
      .valueChanges({ idField: 'id' })
      .pipe(
        map((reservations) =>
          reservations.map((reservation) => ({
            ...reservation,
            borrowStartDate: new Date((reservation.borrowStartDate as any).seconds * 1000),
            borrowEndDate: new Date((reservation.borrowEndDate as any).seconds * 1000),
          }))
        )
      );
  }

  // Ajouter une réservation
  addReservation(reservation: Omit<Reservation, 'id'>): Promise<void> {
    return this.firestore
      .collection(this.collectionName)
      .add({
        ...reservation,
      })
      .then(() => console.log('Réservation ajoutée avec succès.'))
      .catch((error) => {
        console.error('Erreur lors de l\'ajout de la réservation :', error);
        throw error;
      });
  }

  // Récupérer les réservations d'un appareil spécifique
  getReservationsByDeviceId(deviceId: string): Observable<Reservation[]> {
    return this.firestore
      .collection<Reservation>(this.collectionName, (ref) =>
        ref.where('deviceId', '==', deviceId)
      )
      .valueChanges({ idField: 'id' })
      .pipe(
        map((reservations) =>
          reservations.map((reservation) => ({
            ...reservation,
            borrowStartDate: new Date((reservation.borrowStartDate as any).seconds * 1000),
            borrowEndDate: new Date((reservation.borrowEndDate as any).seconds * 1000),
          }))
        )
      );
  }

  // Vérifier les conflits de dates pour un appareil
  checkDateConflicts(deviceId: string, startDate: Date, endDate: Date): Observable<boolean> {
    return this.getReservationsByDeviceId(deviceId).pipe(
      map((reservations) =>
        reservations.some((reservation) =>
          this.isDateOverlap(
            startDate.getTime(),
            endDate.getTime(),
            reservation.borrowStartDate.getTime(),
            reservation.borrowEndDate.getTime()
          )
        )
      )
    );
  }

  // Fonction utilitaire : vérifier si deux plages de dates se chevauchent
  private isDateOverlap(start1: number, end1: number, start2: number, end2: number): boolean {
    return start1 <= end2 && end1 >= start2;
  }

  getNextAvailableDate(deviceId: string, requestedStartDate: Date): Observable<Date | null> {
    return this.getReservationsByDeviceId(deviceId).pipe(
      map((reservations) => {
        const sortedReservations = reservations
          .map((reservation) => ({
            borrowEndDate: new Date((reservation.borrowEndDate as any).seconds * 1000),
          }))
          .sort((a, b) => a.borrowEndDate.getTime() - b.borrowEndDate.getTime());

        // Rechercher la première disponibilité après `requestedStartDate`
        for (const reservation of sortedReservations) {
          if (reservation.borrowEndDate > requestedStartDate) {
            return new Date(reservation.borrowEndDate.getTime() + 24 * 60 * 60 * 1000); // Ajouter un jour après la fin de réservation
          }
        }

        // Si aucune réservation n'est trouvée, retourner la date demandée
        return requestedStartDate;
      })
    );
  }
}
