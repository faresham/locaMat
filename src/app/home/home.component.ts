import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceService, Device } from '../services/device/device.service';
import { ReservationService, Reservation } from '../services/reservation/reservation.service';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  devices: Device[] = [];
  reservations: Reservation[] = [];
  nextAvailableDate: any | null = null;
  filteredDevices: Device[] = [];
  searchTerm: string = '';
  selectedDevice: Device | null = null;
  isAdmin: boolean = false;

  constructor(
    private deviceService: DeviceService,
    private reservationService: ReservationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDevicesAndReservations();
    this.authService.isAdmin().subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    });
  }

  private loadDevicesAndReservations(): void {
    this.deviceService.getDevices().subscribe((devices) => {
      this.devices = devices;
      this.filteredDevices = devices;
    });

    this.reservationService.getReservations().subscribe((reservations) => {
      this.reservations = reservations;
    });
  }

  getReservationsForDevice(deviceId: string): Reservation[] {
    return this.reservations.filter((reservation) => reservation.deviceId === deviceId);
  }

  getNextAvailableDateForDevice(deviceId: string): Date | null {
    // Récupérer les réservations pour l'appareil
    const reservations = this.getReservationsForDevice(deviceId);

    if (reservations.length > 0) {
      // Trier les réservations par date de début croissante
      const sortedReservations = reservations.sort(
        (a, b) => new Date(a.borrowStartDate).getTime() - new Date(b.borrowStartDate).getTime()
      );

      // Rechercher le premier intervalle libre entre les réservations
      for (let i = 0; i < sortedReservations.length - 1; i++) {
        const currentEndDate = new Date(sortedReservations[i].borrowEndDate);
        const nextStartDate = new Date(sortedReservations[i + 1].borrowStartDate);

        // Vérifier s'il y a un intervalle libre entre les réservations
        if (currentEndDate.getTime() + 24 * 60 * 60 * 1000 < nextStartDate.getTime()) {
          // Retourner le jour après la fin de la réservation actuelle
          return new Date(currentEndDate.getTime() + 24 * 60 * 60 * 1000);
        }
      }

      // Si aucune date libre entre les réservations, prendre la fin de la dernière réservation
      const lastEndDate = new Date(
        sortedReservations[sortedReservations.length - 1].borrowEndDate
      );
      return new Date(lastEndDate.getTime() + 24 * 60 * 60 * 1000);
    }

    // Si aucune réservation, l'appareil est immédiatement disponible
    return null;
  }




  filterDevices(): void {
    const search = this.searchTerm.toLowerCase();
    this.filteredDevices = this.devices.filter((device) =>
      device.name.toLowerCase().includes(search) ||
      (device.reference && device.reference.toLowerCase().includes(search)) ||
      (device.version && device.version.toLowerCase().includes(search))
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredDevices = [...this.devices];
  }

  openModal(device: Device): void {
    this.selectedDevice = device;
    this.nextAvailableDate = this.getNextAvailableDateForDevice(device.id!);
  }

  closeModal(): void {
    this.selectedDevice = null;
  }

  navigateToReservation(deviceId: string): void {
    this.router.navigate(['/reservation'], { queryParams: { deviceId } });
  }
}
