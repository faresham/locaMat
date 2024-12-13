import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeviceService } from '../services/device/device.service';

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.css']
})
export class AddDeviceComponent {
  deviceForm: FormGroup;

  constructor(private fb: FormBuilder, private deviceService: DeviceService) {
    // Initialisation du formulaire réactif avec validation
    this.deviceForm = this.fb.group({
      name: ['', Validators.required],
      reference: ['', Validators.required],
      phoneNumber: [''], // Optionnel
      photo: [''],       // Optionnel
      version: ['', Validators.required]
    });
  }

  addDevice() {
    if (this.deviceForm.valid) {
      const device = {
        ...this.deviceForm.value,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.deviceService.addDevice(device)
        .then(() => {
          alert('Matériel ajouté avec succès !');
          this.deviceForm.reset(); // Réinitialiser le formulaire
        })
        .catch((error) => {
          console.error('Erreur lors de l\'ajout du matériel :', error);
        });
    } else {
      alert('Veuillez remplir tous les champs obligatoires.');
    }
  }
}
