import { Component, OnInit } from '@angular/core';
import { DeviceService, Device } from '../services/device/device.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  devices: Device[] = [];
  filteredDevices: Device[] = [];
  searchTerm: string = '';

  constructor(private deviceService: DeviceService) {}

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
}
