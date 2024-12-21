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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private deviceService: DeviceService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.deviceId = params['deviceId'];
      this.fetchDeviceDetails();
    });
  }

  fetchDeviceDetails(): void {
    if (!this.deviceId) return;

    this.deviceService.getDeviceById(this.deviceId).subscribe((device) => {
      this.deviceDetails = device;
    });
  }

  confirmReservation(): void {
    if (!this.borrowStartDate || !this.borrowEndDate) {
      alert('Veuillez sélectionner des dates valides.');
      return;
    }

    const reservation: Reservation = {
      borrowStartDate: this.borrowStartDate,
      borrowEndDate: this.borrowEndDate,
      user: 'currentUserId', // Remplacez par l'utilisateur connecté
      deviceId: this.deviceId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.reservationService.addReservation(reservation).then(
      () => {
        alert('Réservation confirmée !');
        this.router.navigate(['/']); // Retourne à la page principale
      },
      (error) => {
        console.error('Erreur lors de la réservation :', error);
        alert('Une erreur est survenue.');
      }
    );
  }
}
