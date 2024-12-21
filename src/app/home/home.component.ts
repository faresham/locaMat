import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceService, Device } from '../services/device/device.service';
import { ReservationService, Reservation } from '../services/reservation/reservation.service';
import {AuthService} from '../services/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  devices: Device[] = [];
  reservations: Reservation[] = [];
  filteredDevices: Device[] = [];
  searchTerm: string = '';
  selectedDevice: Device | null = null;

  constructor(
    private deviceService: DeviceService,
    private reservationService: ReservationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Charger les appareils
    this.deviceService.getDevices().subscribe((devices: Device[]) => {
      this.devices = devices;
      this.filteredDevices = devices;
    });

    // Charger les réservations
    this.reservationService.getReservations().subscribe((reservations: Reservation[]) => {
      this.reservations = reservations;
    });
  }

  // Filtrer les appareils en fonction du champ de recherche
  filterDevices(): void {
    this.filteredDevices = this.devices.filter((device) =>
      device.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  //
  getReservationsForDevice(deviceId: string): Reservation[] {
    return this.reservations.filter((reservation) => reservation.deviceId === deviceId);
  }

  // Vérifier si un appareil est réservé
  isDeviceReserved(deviceId: string): boolean {
    return this.reservations.some(
      (reservation) => reservation.deviceId === deviceId
    );
  }

  // Ouvrir la modal pour un appareil donné
  openModal(device: Device): void {
    this.selectedDevice = device;
  }

  // Fermer la modal
  closeModal(): void {
    this.selectedDevice = null;
  }

  // Naviguer vers la page de réservation
  navigateToReservation(deviceId: string): void {
    this.router.navigate(['/reservation'], { queryParams: { deviceId } });
  }
}
