import { Component, OnInit } from '@angular/core';
import { DeviceService, Device } from '../services/device/device.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-device-management',
  templateUrl: './device-management.component.html',
  styleUrls: ['./device-management.component.css'],
})
export class DeviceManagementComponent implements OnInit {
  devices: Device[] = []; // Liste complète des matériels
  displayedDevices: Device[] = []; // Liste filtrée pour affichage
  searchTerm: string = ''; // Terme de recherche

  dialogDevice: Partial<Device> = {
    name: '',
    reference: '',
    version: '',
    phoneNumber: '',
    photo: '', // Ajout du champ "photo"
  }; // Données pour la modal
  isDialogOpen = false; // État d'ouverture de la modal
  isEditing = false; // Détermine si on est en mode édition

  constructor(private deviceService: DeviceService, private router: Router) {}

  ngOnInit(): void {
    this.loadDevices(); // Charger les matériels au démarrage
  }

  // Charger tous les matériels depuis Firebase
  loadDevices(): void {
    this.deviceService.getDevices().subscribe(
      (devices) => {
        this.devices = devices;
        this.displayedDevices = devices; // Affichage initial
      },
      (error) => {
        console.error('Erreur lors du chargement des appareils :', error);
        alert('Impossible de charger les appareils.');
      }
    );
  }

  // Filtrer les matériels en fonction du terme de recherche
  filterDevices(): void {
    this.displayedDevices = this.devices.filter(
      (device) =>
        device.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        device.reference?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        device.version?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        device.phoneNumber?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Ouvrir la modal pour ajouter ou modifier un matériel
  openDialog(device?: Device): void {
    this.isDialogOpen = true;
    this.isEditing = !!device; // Mode édition si un appareil est passé
    this.dialogDevice = device
      ? { ...device }
      : { name: '', reference: '', version: '', phoneNumber: '', photo: '' }; // Nouveau matériel
  }

  // Enregistrer un matériel (ajouter ou modifier)
  saveDialogDevice(): void {
    if (this.isEditing) {
      // Modification d'un appareil existant
      this.deviceService.updateDevice(this.dialogDevice.id!, this.dialogDevice as Device).then(
        () => {
          alert('Appareil modifié avec succès !');
          this.loadDevices(); // Recharger la liste
          this.closeDialog();
        },
        (error) => {
          console.error('Erreur lors de la modification :', error);
          alert('Impossible de modifier cet appareil.');
        }
      );
    } else {
      // Ajout d'un nouvel appareil
      this.deviceService.addDevice(this.dialogDevice as Device).then(
        () => {
          alert('Appareil ajouté avec succès !');
          this.loadDevices(); // Recharger la liste
          this.closeDialog();
        },
        (error) => {
          console.error('Erreur lors de l\'ajout :', error);
          alert('Impossible d\'ajouter cet appareil.');
        }
      );
    }
  }

  // Fermer la modal
  closeDialog(): void {
    this.isDialogOpen = false;
    this.dialogDevice = { name: '', reference: '', version: '', phoneNumber: '', photo: '' };
    this.isEditing = false;
  }

  // Rediriger vers la page d'édition pour un matériel spécifique
  editDevice(id: string): void {
    this.router.navigate(['/edit-device', id]);
  }

  // Supprimer un matériel
  deleteDevice(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet appareil ?')) {
      this.deviceService.deleteDevice(id).then(
        () => {
          alert('Appareil supprimé avec succès !');
          this.loadDevices(); // Recharger les matériels après suppression
        },
        (error) => {
          console.error('Erreur lors de la suppression :', error);
          alert('Impossible de supprimer cet appareil.');
        }
      );
    }
  }
}
