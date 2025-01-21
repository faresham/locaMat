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

  getAvailableSlots(deviceId: string): Observable<{ start: Date; end: Date }[]> {
    return this.getReservationsByDeviceId(deviceId).pipe(
      map((reservations) => {
        // Trier les réservations par date de début
        const sortedReservations = reservations.sort(
          (a, b) => a.borrowStartDate.getTime() - b.borrowStartDate.getTime()
        );

        const availableSlots: { start: Date; end: Date }[] = [];
        const today = new Date();

        // Vérifier la disponibilité avant la première réservation
        if (sortedReservations.length === 0 || sortedReservations[0].borrowStartDate > today) {
          availableSlots.push({
            start: today,
            end: sortedReservations[0]?.borrowStartDate || new Date(9999, 11, 31),
          });
        }

        // Vérifier les créneaux entre les réservations
        for (let i = 0; i < sortedReservations.length - 1; i++) {
          const currentEnd = sortedReservations[i].borrowEndDate;
          const nextStart = sortedReservations[i + 1].borrowStartDate;

          if (currentEnd < nextStart) {
            availableSlots.push({ start: new Date(currentEnd.getTime() + 1), end: nextStart });
          }
        }

        // Vérifier la disponibilité après la dernière réservation
        if (sortedReservations.length > 0) {
          const lastEnd = sortedReservations[sortedReservations.length - 1].borrowEndDate;
          availableSlots.push({ start: new Date(lastEnd.getTime() + 1), end: new Date(9999, 11, 31) });
        }

        return availableSlots;
      })
    );
  }
}
