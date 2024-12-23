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
  devices: Device[] = []; // Liste complète des appareils
  reservations: Reservation[] = []; // Liste complète des réservations
  filteredDevices: Device[] = []; // Appareils filtrés en fonction de la recherche
  searchTerm: string = ''; // Terme de recherche
  selectedDevice: Device | null = null; // Appareil actuellement sélectionné
  isAdmin: boolean = false; // Par défaut, l'utilisateur n'est pas administrateur


  constructor(
    private deviceService: DeviceService,
    private reservationService: ReservationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Charger la liste des appareils
    this.deviceService.getDevices().subscribe((devices: Device[]) => {
      this.devices = devices;
      this.filteredDevices = devices;
    });

    // Charger les réservations
    this.reservationService.getReservations().subscribe((reservations: Reservation[]) => {
      this.reservations = reservations;
    });

    // Vérifier si l'utilisateur est administrateur
    this.authService.isAdmin().subscribe((isAdmin) => {
      this.isAdmin = isAdmin; // Met à jour la variable locale
    });
  }

  // Filtrer les appareils en fonction du champ de recherche
  filterDevices(): void {
    const search = this.searchTerm.toLowerCase();
    this.filteredDevices = this.devices.filter((device) =>
      device.name.toLowerCase().includes(search) ||
      (device.reference && device.reference.toLowerCase().includes(search)) ||
      (device.version && device.version.toLowerCase().includes(search))
    );
  }

  // Effacer la recherche
  clearSearch(): void {
    this.searchTerm = '';
    this.filteredDevices = [...this.devices]; // Réinitialiser la liste complète
  }

  // Récupérer les réservations pour un appareil donné
  getReservationsForDevice(deviceId: string): Reservation[] {
    return this.reservations.filter((reservation) => reservation.deviceId === deviceId);
  }

  // Vérifier si un appareil est réservé
  isDeviceReserved(deviceId: string): boolean {
    return this.reservations.some((reservation) => reservation.deviceId === deviceId);
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

  // Naviguer vers la page de modification
  navigateToEditDevice(deviceId: string): void {
    this.router.navigate(['/edit-device', deviceId]);
  }
}
