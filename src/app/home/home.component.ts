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

  getNextAvailableDateForDevice(deviceId: string): string {
    const reservations = this.getReservationsForDevice(deviceId);

    if (reservations.length > 0) {
      const sortedReservations = reservations
        .map((res) => res.borrowEndDate)
        .sort((a, b) => a.getTime() - b.getTime());

      const lastEndDate = sortedReservations[sortedReservations.length - 1];
      const nextAvailableDate = new Date(lastEndDate.getTime() + 24 * 60 * 60 * 1000);
      return nextAvailableDate.toLocaleDateString();
    }

    return 'Disponible'; // Si aucune réservation, immédiatement disponible
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

  navigateToEditDevice(deviceId: string): void {
    this.router.navigate(['/edit-device', deviceId]);
  }
}
