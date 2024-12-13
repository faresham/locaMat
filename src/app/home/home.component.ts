import { Component, OnInit } from '@angular/core';
import { DeviceService, Device } from '../services/device/device.service';
import { ReservationService } from '../services/reservation/reservation.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  devices: Device[] = [];
  filteredDevices: Device[] = [];
  searchTerm: string = '';
  selectedDevice: Device | null = null;

  constructor(
    private deviceService: DeviceService,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.deviceService.getDevices().subscribe((data: Device[]) => {
      this.devices = data;
      this.filteredDevices = data;
    });
  }

  filterDevices(): void {
    this.filteredDevices = this.devices.filter((device) =>
      device.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openModal(device: Device): void {
    this.selectedDevice = device;
  }

  closeModal(): void {
    this.selectedDevice = null;
  }

  reserveDevice(): void {
    if (!this.selectedDevice || !this.selectedDevice.id) {
      alert('Erreur : L\'ID de l\'appareil est introuvable.');
      return;
    }

    const reservation = {
      borrowStartDate: new Date(),
      borrowEndDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      user: 'currentUserId', // Remplace par l'utilisateur connecté
      deviceId: this.selectedDevice.id, // Passe uniquement l'ID de l'appareil
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.reservationService.addReservation(reservation).then(
      () => {
        alert('Réservation réussie !');
        this.closeModal();
      },
      () => {
        alert('Erreur lors de la réservation.');
      }
    );
  }
}
