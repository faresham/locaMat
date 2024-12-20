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
  deviceDetails: Device | null = null; // Stocker les informations de l'appareil
  borrowStartDate: Date | null = null;
  borrowEndDate: Date | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private deviceService: DeviceService // Injecter le service des appareils
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.deviceId = params['deviceId'];
      this.fetchDeviceDetails(); // Charger les détails de l'appareil
    });
  }

  fetchDeviceDetails(): void {
    if (!this.deviceId) {
      return;
    }

    this.deviceService.getDeviceById(this.deviceId).subscribe(
      (device) => {
        this.deviceDetails = device;
      },
      (error) => {
        console.error('Erreur lors du chargement des détails de l’appareil :', error);
      }
    );
  }

  confirmReservation(): void {
    if (!this.borrowStartDate || !this.borrowEndDate) {
      alert('Veuillez saisir une plage de dates valide.');
      return;
    }

    const reservation: Omit<Reservation, 'id'> = {
      borrowStartDate: this.borrowStartDate,
      borrowEndDate: this.borrowEndDate,
      user: 'currentUserId', // Remplace par l'utilisateur connecté
      deviceId: this.deviceId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.reservationService.addReservation(reservation).then(
      () => {
        alert('Réservation confirmée !');
        this.router.navigate(['/home']); // Retourne à la page principale
      },
      (error) => {
        console.error('Erreur lors de la réservation :', error);
        alert('Une erreur est survenue.');
      }
    );
  }
}
