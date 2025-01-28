import { Component, OnInit } from '@angular/core';
import { ReservationService, Reservation } from '../services/reservation/reservation.service';
import { AuthService } from '../services/auth/auth.service';
import { DeviceService } from '../services/device/device.service';

@Component({
  selector: 'app-reservation-management',
  templateUrl: './reservation-management.component.html',
  styleUrls: ['./reservation-management.component.css'],
})
export class ReservationManagementComponent implements OnInit {
  reservations: any[] = []; // Liste enrichie
  displayedReservations: any[] = []; // Liste filtrée
  searchTerm: string = ''; // Terme de recherche

  dialogReservation: Partial<Reservation> = {
    user: '',
    deviceId: '',
    borrowStartDate: undefined,
    borrowEndDate: undefined,
  };

  isDialogOpen: boolean = false;
  isEditing: boolean = false;

  constructor(
    private reservationService: ReservationService,
    private authService: AuthService,
    private deviceService: DeviceService
  ) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    console.log('🔵 [Début] Chargement des réservations...');

    this.reservationService.getReservations().subscribe(
      (reservations) => {
        console.log('✅ [Step 1] Réservations brutes récupérées:', reservations);

        const enrichedReservations: any[] = [];
        reservations.forEach((reservation, index) => {
          console.log(`🔄 [Step 2] Traitement de la réservation ID: ${reservation.id}`, reservation);

          // Récupérer les détails de l'utilisateur
          this.authService.getUserDetails(reservation.user).subscribe(
            (user) => {
              console.log(`👤 [Step 3] Détails de l'utilisateur récupérés pour ${reservation.user}:`, user);

              // Récupérer les détails de l'appareil
              this.deviceService.getDeviceById(reservation.deviceId).subscribe(
                (device) => {
                  console.log(`📱 [Step 4] Détails de l'appareil récupérés pour ${reservation.deviceId}:`, device);

                  // Ajouter la réservation enrichie à la liste
                  const enrichedReservation = {
                    ...reservation,
                    userFullName: user ? `${user.prenom} ${user.nom}` : 'Utilisateur inconnu',
                    deviceName: device ? device.name : 'Appareil inconnu',
                    deviceReference: device ? device.reference : 'Référence inconnue',
                    deviceVersion: device ? device.version : 'Version inconnue',
                  };

                  console.log('🎯 [Step 5] Réservation enrichie:', enrichedReservation);
                  enrichedReservations.push(enrichedReservation);

                  // Vérifier si c'est la dernière réservation
                  if (index === reservations.length - 1) {
                    this.reservations = enrichedReservations;
                    this.displayedReservations = enrichedReservations;
                    console.log('✅ [Final] Toutes les réservations enrichies:', this.displayedReservations);
                  }
                },
                (error) => {
                  console.error(`❌ [Erreur Appareil] Impossible de récupérer l'appareil pour ID ${reservation.deviceId}:`, error);
                }
              );
            },
            (error) => {
              console.error(`❌ [Erreur Utilisateur] Impossible de récupérer l'utilisateur pour ID ${reservation.user}:`, error);
            }
          );
        });
      },
      (error) => {
        console.error('❌ [Erreur] Impossible de charger les réservations:', error);
      }
    );
  }

  // Filtrer les réservations en fonction du terme de recherche
  filterReservations(): void {
    console.log('🔍 [Filtrage] Terme de recherche:', this.searchTerm);

    this.displayedReservations = this.reservations.filter(
      (reservation) =>
        reservation.userFullName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        reservation.deviceName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        reservation.deviceReference?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (reservation.borrowStartDate &&
          new Date(reservation.borrowStartDate).toLocaleDateString().includes(this.searchTerm)) ||
        (reservation.borrowEndDate &&
          new Date(reservation.borrowEndDate).toLocaleDateString().includes(this.searchTerm))
    );

    console.log('📊 [Résultats après filtrage] displayedReservations:', this.displayedReservations);
  }

  // Ouvrir la modal pour ajouter ou modifier une réservation
  openDialog(reservation?: any): void {
    console.log('🟢 [Modal] Ouverture avec réservation:', reservation);

    this.isDialogOpen = true;
    this.isEditing = !!reservation;
    this.dialogReservation = reservation
      ? { ...reservation }
      : { user: '', deviceId: '', borrowStartDate: undefined, borrowEndDate: undefined };
  }

  // Enregistrer une réservation (ajouter ou modifier)
  saveDialogReservation(): void {
    console.log('💾 [Enregistrement] Tentative de sauvegarde:', this.dialogReservation);

    if (this.isEditing) {
      this.reservationService.updateReservation(this.dialogReservation.id!, this.dialogReservation as Reservation).then(
        () => {
          alert('✅ Réservation modifiée avec succès !');
          this.loadReservations();
          this.closeDialog();
        },
        (error) => {
          console.error('❌ Erreur lors de la modification :', error);
          alert('Impossible de modifier cette réservation.');
        }
      );
    } else {
      this.reservationService.addReservation(this.dialogReservation as Reservation).then(
        () => {
          alert('✅ Réservation ajoutée avec succès !');
          this.loadReservations();
          this.closeDialog();
        },
        (error) => {
          console.error('❌ Erreur lors de l\'ajout :', error);
          alert('Impossible d\'ajouter cette réservation.');
        }
      );
    }
  }

  // Fermer la modal
  closeDialog(): void {
    console.log('🔴 [Modal] Fermeture de la modal');

    this.isDialogOpen = false;
    this.dialogReservation = { user: '', deviceId: '', borrowStartDate: undefined, borrowEndDate: undefined };
    this.isEditing = false;
  }

  // Supprimer une réservation
  deleteReservation(id: string): void {
    console.log('🗑 [Suppression] Tentative de suppression de ID:', id);

    if (confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      this.reservationService.deleteReservation(id).then(
        () => {
          alert('✅ Réservation supprimée avec succès !');
          this.loadReservations();
        },
        (error) => {
          console.error('❌ Erreur lors de la suppression :', error);
          alert('Impossible de supprimer cette réservation.');
        }
      );
    }
  }
}
