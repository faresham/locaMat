import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';

export interface Device {
  id: string;
  name: string;
  phoneNumber: string;
  photo: string;
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

  // Récupérer un appareil spécifique par ID
  getDeviceById(id: string): Observable<Device> {
    return this.firestore
      .collection<Device>(this.collectionName)
      .doc(id)
      .valueChanges({ idField: 'id' })
      .pipe(
        map((device) => {
          if (!device) {
            throw new Error('Device not found');
          }
          return device; // Retourne l'appareil trouvé
        })
      );
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

  // Modifier un device
  updateDevice(id: string, device: Partial<Device>): Promise<void> {
    const deviceWithTimestamp = {
      ...device,
      updatedAt: new Date(),
    };
    return this.firestore.collection<Device>(this.collectionName).doc(id).update(deviceWithTimestamp);
  }

  // Supprimer un device
  deleteDevice(id: string): Promise<void> {
    return this.firestore.collection<Device>(this.collectionName).doc(id).delete();
  }
}
