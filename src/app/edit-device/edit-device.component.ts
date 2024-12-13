import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeviceService } from '../services/device/device.service';

@Component({
  selector: 'app-edit-device',
  templateUrl: './edit-device.component.html',
  styleUrls: ['./edit-device.component.css']
})
export class EditDeviceComponent implements OnInit {
  deviceForm!: FormGroup;
  deviceId!: string;

  constructor(
    private fb: FormBuilder,
    private deviceService: DeviceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.deviceId = this.route.snapshot.paramMap.get('id') || '';
    this.deviceService.getDeviceById(this.deviceId).subscribe((device) => {
      if (device) {
        this.deviceForm.patchValue(device);
      }
    });

    this.deviceForm = this.fb.group({
      name: ['', Validators.required],
      reference: ['', Validators.required],
      phoneNumber: [''], // Optionnel
      photo: [''],       // Optionnel
      version: ['', Validators.required]
    });
  }

  updateDevice() {
    if (this.deviceForm.valid) {
      this.deviceService.updateDevice(this.deviceId, this.deviceForm.value).then(() => {
        alert('Matériel modifié avec succès !');
        this.router.navigate(['/']); // Retour à la liste des matériels
      }).catch((error) => {
        console.error('Erreur lors de la mise à jour :', error);
      });
    }
  }
}
