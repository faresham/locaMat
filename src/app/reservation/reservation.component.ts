import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService, Reservation } from '../services/reservation/reservation.service';
import { DeviceService, Device } from '../services/device/device.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css'],
})
export class ReservationComponent implements OnInit {
  deviceId: string = '';
  deviceDetails: Device | null = null;
  borrowStartDate: Date | null = null;
  borrowEndDate: Date | null = null;
  reservedDates: Date[] = []; // List of reserved dates as Date objects

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private deviceService: DeviceService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.deviceId = params['deviceId'];
      if (this.deviceId) {
        this.fetchDeviceDetails();
        this.fetchReservedDates();
      }
    });
  }

  fetchDeviceDetails(): void {
    this.deviceService.getDeviceById(this.deviceId).subscribe((device) => {
      this.deviceDetails = device;
    });
  }

  fetchReservedDates(): void {
    this.reservationService.getReservationsByDeviceId(this.deviceId).subscribe((reservations: Reservation[]) => {
      this.reservedDates = reservations.flatMap((reservation) => {
        const start = new Date(reservation.borrowStartDate);
        const end = new Date(reservation.borrowEndDate);
        const dates: Date[] = [];

        while (start <= end) {
          dates.push(new Date(start)); // Add each date to the list
          start.setDate(start.getDate() + 1);
        }
        return dates;
      });
    });
  }

  // Filter function to disable reserved dates
  isDateReserved: (date: Date | null) => boolean = (date: Date | null): boolean => {
    if (!date) {
      return false; // Null handling
    }

    const isReserved = this.reservedDates.some(
      (reservedDate) =>
        reservedDate.getDate() === date.getDate() &&
        reservedDate.getMonth() === date.getMonth() &&
        reservedDate.getFullYear() === date.getFullYear()
    );

    return !isReserved;
  };

  getNextReservedDate(date: Date): Date | null {
    // Trier les dates réservées pour garantir qu'elles sont dans l'ordre croissant
    const sortedReservedDates = [...this.reservedDates].sort((a, b) => a.getTime() - b.getTime());

    // Trouver la prochaine date réservée après la date donnée
    for (const reservedDate of sortedReservedDates) {
      if (reservedDate.getTime() > date.getTime()) {
        return reservedDate; // Retourne la prochaine date réservée
      }
    }

    return null; // Aucun jour réservé après cette date
  }

  onStartDateChange(): void {
    if (this.borrowStartDate) {
      const nextReservedDate = this.getNextReservedDate(this.borrowStartDate);

      if (nextReservedDate && nextReservedDate.getTime() === this.borrowStartDate.getTime() + 86400000) {
        console.log(`La prochaine date réservée est ${nextReservedDate.toDateString()}.`);
        this.borrowEndDate = this.borrowStartDate;
      }
    }
  }

  onEndDateChange(): void {
    if (this.borrowStartDate && this.borrowEndDate) {
      const nextReservedDate = this.getNextReservedDate(this.borrowStartDate);

      if (nextReservedDate && this.borrowEndDate >= nextReservedDate) {
        alert(`La date de fin doit être avant ${nextReservedDate.toLocaleDateString()}.`);
        this.borrowEndDate = new Date(nextReservedDate.getTime() - 86400000); // Ajuster à la dernière date disponible
      }
    }
  }


  confirmReservation(): void {
    if (!this.borrowStartDate || !this.borrowEndDate || !this.deviceDetails) {
      alert('Veuillez remplir les informations nécessaires.');
      return;
    }

    const reservation: Omit<Reservation, 'id'> = {
      borrowStartDate: new Date(this.borrowStartDate),
      borrowEndDate: new Date(this.borrowEndDate),
      user: '', // Add user if needed
      deviceId: this.deviceId,
    };

    this.reservationService
      .addReservation(reservation)
      .then(() => {
        alert('Réservation confirmée !');
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        alert('Une erreur est survenue lors de la réservation.');
      });
  }
}
