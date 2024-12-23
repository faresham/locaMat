import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Device {
  id?: string; // ID unique généré automatiquement
  name: string; // Nom de l'appareil
  reference: string; // Référence formatée (AN123, AP456, etc.)
  version: string; // Version du matériel
  phoneNumber?: string; // Numéro de téléphone associé (facultatif)
  photo?: string; // Lien vers la photo (facultatif)
  stock: number; // Quantité en stock
  createdAt: Date; // Date de création
  updatedAt?: Date; // Dernière mise à jour
}

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  private collectionName = 'equipment';

  constructor(private firestore: AngularFirestore) {}

  // Récupérer tous les appareils
  getDevices(): Observable<Device[]> {
    return this.firestore
      .collection<Device>(this.collectionName)
      .valueChanges({ idField: 'id' });
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
            throw new Error('Appareil introuvable.');
          }
          return device;
        })
      );
  }

  // Ajouter un appareil avec validation
  async addDevice(device: Device): Promise<void> {
    this.validateDevice(device);
    const id = this.firestore.createId(); // Générer un ID unique
    const deviceWithTimestamps = {
      ...device,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return this.firestore
      .collection<Device>(this.collectionName)
      .doc(id)
      .set(deviceWithTimestamps);
  }

  // Mettre à jour un appareil existant
  async updateDevice(id: string, device: Partial<Device>): Promise<void> {
    this.validateDevice(device as Device, true); // Validation avec contexte de modification
    const deviceWithTimestamp = {
      ...device,
      updatedAt: new Date(),
    };
    return this.firestore
      .collection<Device>(this.collectionName)
      .doc(id)
      .update(deviceWithTimestamp);
  }

  // Supprimer un appareil
  deleteDevice(id: string): Promise<void> {
    return this.firestore
      .collection<Device>(this.collectionName)
      .doc(id)
      .delete();
  }

  // Valider les champs de l'appareil
  private validateDevice(device: Device, isUpdate = false): void {
    // Validation du nom
    if (!device.name || device.name.length < 1 || device.name.length > 30) {
      throw new Error("Le champ 'Nom' est obligatoire et doit contenir entre 1 et 30 caractères.");
    }

    // Validation de la référence
    const refRegex = /^(AN|AP|XX)\d{3}$/;
    if (!refRegex.test(device.reference)) {
      throw new Error("La référence doit commencer par 'AN', 'AP', ou 'XX', suivi de 3 chiffres.");
    }

    // Validation de la version
    if (!device.version || device.version.length < 3 || device.version.length > 15) {
      throw new Error("Le champ 'Version' est obligatoire et doit contenir entre 3 et 15 caractères.");
    }

    // Validation du numéro de téléphone (facultatif)
    if (device.phoneNumber && !/^\d{10}$/.test(device.phoneNumber)) {
      throw new Error("Le champ 'Numéro de téléphone' doit contenir exactement 10 chiffres.");
    }

    // Validation du stock
    if (!isUpdate && device.stock < 0) {
      throw new Error("Le champ 'Stock' doit être un nombre positif.");
    }
  }
}
