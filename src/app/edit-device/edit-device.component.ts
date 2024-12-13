import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service'; // Assurez-vous d'avoir un service d'authentification
import { DeviceService } from '../services/device/device.service';

@Component({
  selector: 'app-edit-device',
  templateUrl: './edit-device.component.html',
  styleUrls: ['./edit-device.component.css']
})
export class EditDeviceComponent implements OnInit {
  deviceForm!: FormGroup;
  deviceId!: string;
  isAdmin: boolean = false; // Ajoutez cette variable

  constructor(
    private fb: FormBuilder,
    private deviceService: DeviceService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService // Injectez un service pour vérifier le rôle
  ) {}

  ngOnInit(): void {
    this.deviceId = this.route.snapshot.paramMap.get('id') || '';
  
    // Obtenez l'UID de l'utilisateur connecté
    const uid = this.authService.getCurrentUserUid(); // Une méthode pour récupérer l'UID
  
    // Vérifiez si l'utilisateur est administrateur
    if (uid) {
      this.authService.isAdmin(uid).subscribe((isAdmin) => {
        this.isAdmin = isAdmin;
      });
    }

  }

  updateDevice() {
    if (this.deviceForm.valid) {
      const updatedDevice = this.deviceForm.value;
      this.deviceService.updateDevice(this.deviceId, updatedDevice).then(() => {
        alert('Matériel modifié avec succès !');
        this.router.navigate(['/']); // Rediriger vers la liste
      }).catch((error) => {
        console.error('Erreur lors de la modification du matériel :', error);
      });
    } else {
      alert('Veuillez remplir tous les champs obligatoires.');
    }
  }
}
