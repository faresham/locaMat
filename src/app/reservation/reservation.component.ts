import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService, Reservation } from '../services/reservation/reservation.service';
import { DeviceService, Device } from '../services/device/device.service';
import { AuthService } from '../services/auth/auth.service';

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
  reservations: Reservation[] = [];
  currentUserId: string | null = null;
  nextAvailableDate: Date | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private deviceService: DeviceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUserId = user?.uid || null;
    });

    this.route.queryParams.subscribe((params) => {
      this.deviceId = params['deviceId'];
      if (this.deviceId) {
        this.fetchDeviceDetails();
        this.fetchReservations();
      }
    });
  }

  fetchDeviceDetails(): void {
    this.deviceService.getDeviceById(this.deviceId).subscribe((device) => {
      this.deviceDetails = device;
    });
  }

  fetchReservations(): void {
    this.reservationService.getReservationsByDeviceId(this.deviceId).subscribe((reservations) => {
      this.reservations = reservations;
      this.fetchNextAvailableDate();
    });
  }

  fetchNextAvailableDate(): void {
    if (this.reservations.length > 0) {
      const sortedReservations = this.reservations
        .map((res) => res.borrowEndDate)
        .sort((a, b) => a.getTime() - b.getTime());

      const lastEndDate = sortedReservations[sortedReservations.length - 1];
      this.nextAvailableDate = new Date(lastEndDate.getTime() + 24 * 60 * 60 * 1000);
    } else {
      this.nextAvailableDate = new Date(); // Disponible immédiatement
    }
  }

  confirmReservation(): void {
    if (!this.borrowStartDate || !this.borrowEndDate || !this.deviceDetails || !this.currentUserId) {
      alert('Veuillez remplir toutes les informations nécessaires.');
      return;
    }

    const hasConflict = this.checkDateConflict(this.borrowStartDate, this.borrowEndDate);

    if (hasConflict) {
      this.getNextAvailableDate();
      alert('Les dates sélectionnées sont indisponibles.');
      this.borrowStartDate = null;
      this.borrowEndDate = null;
      return;
    }

    const reservation: Omit<Reservation, 'id'> = {
      borrowStartDate: new Date(this.borrowStartDate!),
      borrowEndDate: new Date(this.borrowEndDate!),
      user: this.currentUserId!,
      deviceId: this.deviceId,
    };

    this.reservationService
      .addReservation(reservation)
      .then(() => {
        alert('Réservation confirmée !');
        this.borrowStartDate = null;
        this.borrowEndDate = null;
        console.log('Réservation effectuée avec succès :', reservation);
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        console.error('Erreur lors de la réservation :', error);
        alert('Une erreur est survenue lors de la réservation.');
      });
  }

  checkDateConflict(startDate: Date, endDate: Date): boolean {
    return this.reservations.some((reservation) => {
      const resStart = reservation.borrowStartDate.getTime();
      const resEnd = reservation.borrowEndDate.getTime();
      return startDate.getTime() <= resEnd && endDate.getTime() >= resStart;
    });
  }

  getNextAvailableDate(): void {
    const sortedReservations = this.reservations
      .map((res) => res.borrowEndDate)
      .sort((a, b) => a.getTime() - b.getTime());

    if (sortedReservations.length > 0) {
      const lastEndDate = sortedReservations[sortedReservations.length - 1];
      this.nextAvailableDate = new Date(lastEndDate.getTime() + 24 * 60 * 60 * 1000);
      alert(`Prochaine disponibilité : ${this.nextAvailableDate.toLocaleDateString()}`);
    } else {
      this.nextAvailableDate = new Date();
      alert(`L'appareil est disponible dès maintenant.`);
    }
  }
}
