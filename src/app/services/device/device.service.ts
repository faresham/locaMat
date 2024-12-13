import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

export interface Device {
  id?: string;
  name: string;
  phoneNumber?: string;
  photo?: string;
  reference: string;
  version: string;
  createdAt: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private collectionName = 'equipment';

  constructor(private firestore: AngularFirestore) {}

  // Récupérer tous les devices
  getDevices(): Observable<Device[]> {
    return this.firestore.collection<Device>(this.collectionName).valueChanges({ idField: 'id' });
  }

  // Ajouter un device
  addDevice(device: Device): Promise<void> {
    const id = this.firestore.createId();
    const deviceWithTimestamps = {
      ...device,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return this.firestore.collection<Device>(this.collectionName).doc(id).set(deviceWithTimestamps);
  }

   // Méthode pour mettre à jour un matériel
   updateDevice(id: string, device: Partial<Device>): Promise<void> {
    return this.firestore.collection<Device>(this.collectionName).doc(id).update(device);
  }

  // Méthode pour obtenir un matériel par son ID
  getDeviceById(id: string) {
    return this.firestore.collection<Device>(this.collectionName).doc(id).valueChanges();
  }

  // Supprimer un device
  deleteDevice(id: string): Promise<void> {
    return this.firestore.collection<Device>(this.collectionName).doc(id).delete();
  }
}
