import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService, Reservation } from '../services/reservation/reservation.service';
import { DeviceService, Device } from '../services/device/device.service';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';

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
  reservedDates: string[] = []; // Liste des dates réservées sous format YYYY-MM-DD

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
        const dates: string[] = [];

        // Générer toutes les dates entre start et end
        while (start <= end) {
          dates.push(start.toISOString().split('T')[0]); // Format YYYY-MM-DD
          start.setDate(start.getDate() + 1);
        }

        return dates;
      });

      console.log('Dates réservées :', this.reservedDates);
    });
  }

  // Appliquer une classe pour les jours réservés
  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view === 'month') {
      const dateString = cellDate.toISOString().split('T')[0];
      return this.reservedDates.includes(dateString) ? 'reserved-date' : '';
    }
    return '';
  };

  confirmReservation(): void {
    if (!this.borrowStartDate || !this.borrowEndDate || !this.deviceDetails) {
      alert('Veuillez remplir les informations nécessaires.');
      return;
    }

    const reservation: Omit<Reservation, 'id'> = {
      borrowStartDate: new Date(this.borrowStartDate),
      borrowEndDate: new Date(this.borrowEndDate),
      user: '', // Ajouter l'utilisateur si nécessaire
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
