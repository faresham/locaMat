import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService, Reservation } from '../services/reservation/reservation.service';
import { DeviceService, Device } from '../services/device/device.service';
import {AuthService} from '../services/auth/auth.service';
// @ts-ignore
import firebase from 'firebase/compat';
import User = firebase.User;


@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css'],
})
export class ReservationComponent implements OnInit {
  deviceId: string = '';
  userId: string = '';
  deviceDetails: Device | null = null;
  borrowStartDate: Date | null = null;
  borrowEndDate: Date | null = null;
  reservedDates: Date[] = []; // List of reserved dates as Date objects

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private deviceService: DeviceService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.deviceId = params['deviceId'];
      if (this.deviceId) {
        this.fetchDeviceDetails();
        this.fetchReservedDates();
      }
    });

    this.authService.getCurrentUser().subscribe((user: User) => {
      this.userId = user.uid;
      }
    )
  }

  // Récupérer les détails de l'appareil
  fetchDeviceDetails(): void {
    this.deviceService.getDeviceById(this.deviceId).subscribe(
      (device) => {
        this.deviceDetails = device;
      },
      (error) => {
        console.error('Erreur lors de la récupération des détails de l\'appareil :', error);
      }
    );
  }

  // Récupérer les dates réservées pour l'appareil
  fetchReservedDates(): void {
    this.reservationService.getReservationsByDeviceId(this.deviceId).subscribe(
      (reservations: Reservation[]) => {
        this.reservedDates = reservations.flatMap((reservation) => {
          const start = new Date(reservation.borrowStartDate!);
          const end = new Date(reservation.borrowEndDate!);
          const dates: Date[] = [];

          while (start <= end) {
            dates.push(new Date(start));
            start.setDate(start.getDate() + 1); // Ajouter un jour
          }
          return dates;
        });
      },
      (error) => {
        console.error('Erreur lors de la récupération des dates réservées :', error);
      }
    );
  }

  // Vérifier si une date est réservée
  isDateReserved = (date: Date | null): boolean => {
    if (!date) {
      return false;
    }

    return this.reservedDates.some(
      (reservedDate) =>
        reservedDate.getDate() === date.getDate() &&
        reservedDate.getMonth() === date.getMonth() &&
        reservedDate.getFullYear() === date.getFullYear()
    );
  };

  // Obtenir la prochaine date réservée après une date donnée
  getNextReservedDate(date: Date): Date | null {
    const sortedReservedDates = [...this.reservedDates].sort((a, b) => a.getTime() - b.getTime());

    for (const reservedDate of sortedReservedDates) {
      if (reservedDate.getTime() > date.getTime()) {
        return reservedDate;
      }
    }

    return null; // Pas de date réservée après celle-ci
  }

  // Gérer les changements de la date de début
  onStartDateChange(): void {
    if (this.borrowStartDate) {
      const nextReservedDate = this.getNextReservedDate(this.borrowStartDate);

      if (nextReservedDate && nextReservedDate.getTime() === this.borrowStartDate.getTime() + 86400000) {
        this.borrowEndDate = this.borrowStartDate; // Ajuster la date de fin si nécessaire
      }
    }
  }

  // Gérer les changements de la date de fin
  onEndDateChange(): void {
    if (this.borrowStartDate && this.borrowEndDate) {
      const nextReservedDate = this.getNextReservedDate(this.borrowStartDate);

      if (nextReservedDate && this.borrowEndDate >= nextReservedDate) {
        alert(`La date de fin doit être avant ${nextReservedDate.toLocaleDateString()}.`);
        this.borrowEndDate = new Date(nextReservedDate.getTime() - 86400000); // Ajuster à la dernière date disponible
      }
    }
  }

  // Confirmer une réservation
  confirmReservation(): void {
    if (!this.borrowStartDate || !this.borrowEndDate || !this.deviceDetails) {
      alert('Veuillez remplir toutes les informations nécessaires.');
      return;
    }

    const reservation: Omit<Reservation, 'id'> = {
      borrowStartDate: new Date(this.borrowStartDate),
      borrowEndDate: new Date(this.borrowEndDate),
      user: this.userId,
      deviceId: this.deviceId,
    };

    this.reservationService
      .addReservation(reservation)
      .then(() => {
        alert('Réservation confirmée !');
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        console.error('Erreur lors de la réservation :', error);
        alert('Une erreur est survenue lors de la réservation.');
      });
  }
}
