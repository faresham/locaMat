import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceService, Device } from '../services/device/device.service';

@Component({
  selector: 'app-add-edit-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.css'],
})
export class AddDeviceComponent implements OnInit {
  device: Partial<Device> = {
    name: '',
    reference: '',
    version: '',
    phoneNumber: '',
    photo: '',
    stock: 0,
  };
  isEditMode = false; // Détecte si nous sommes en mode modification
  isSubmitting = false;

  constructor(
    private deviceService: DeviceService,
    private route: ActivatedRoute, // Pour récupérer l'ID
    private router: Router
  ) {}

  ngOnInit(): void {
    // Vérifiez si un ID est présent dans l'URL
    const deviceId = this.route.snapshot.paramMap.get('id');
    if (deviceId) {
      this.isEditMode = true; // Mode modification activé
      this.deviceService.getDeviceById(deviceId).subscribe(
        (device) => {
          this.device = device; // Charger les données de l'appareil à modifier
        },
        (error) => {
          console.error('Erreur lors du chargement de l\'appareil :', error);
          alert('Impossible de charger cet appareil.');
          this.router.navigate(['/home']);
        }
      );
    }
  }

  submitDevice(): void {
    if (this.isSubmitting) return;

    this.isSubmitting = true;

    if (this.isEditMode) {
      // Mode modification
      this.deviceService
        .updateDevice(this.device.id!, {
          ...this.device,
          updatedAt: new Date(),
        } as Partial<Device>)
        .then(() => {
          alert('Appareil modifié avec succès !');
          this.router.navigate(['/home']);
        })
        .catch((error) => {
          console.error('Erreur lors de la modification :', error);
          alert(error.message || 'Une erreur est survenue.');
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    } else {
      // Mode ajout
      this.deviceService
        .addDevice({
          ...this.device,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as Device)
        .then(() => {
          alert('Matériel ajouté avec succès !');
          this.router.navigate(['/home']);
        })
        .catch((error) => {
          console.error('Erreur lors de l\'ajout du matériel :', error);
          alert(error.message || 'Une erreur est survenue.');
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    }
  }
}
