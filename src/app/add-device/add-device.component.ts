import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.css']
})
export class AddDeviceComponent {
  device = {
    name: '',
    reference: '',
    phoneNumber: '',
    photo: ''
  };

  constructor(private firestore: AngularFirestore) {}

  addDevice() {
    this.firestore.collection('equipment').add({
      ...this.device,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 'V1.0'
    }).then(() => {
      alert('Matériel ajouté avec succès !');
      this.device = { name: '', reference: '', phoneNumber: '', photo: '' }; // Réinitialiser le formulaire
    }).catch((error) => {
      console.error('Erreur lors de l\'ajout du matériel :', error);
    });
  }
}
