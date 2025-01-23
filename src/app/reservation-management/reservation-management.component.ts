import { Component, OnInit } from '@angular/core';
import { ReservationService, Reservation } from '../services/reservation/reservation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reservation-management',
  templateUrl: './reservation-management.component.html',
  styleUrls: ['./reservation-management.component.css'],
})
export class ReservationManagementComponent implements OnInit {
  reservations: Reservation[] = []; // Liste complète des réservations
  displayedReservations: Reservation[] = []; // Liste filtrée pour affichage
  searchTerm: string = ''; // Terme de recherche

  // Variables pour les dates
  borrowStartDate: Date | undefined = undefined;
  borrowEndDate: Date | undefined = undefined;

  // Variables pour la modal
  dialogReservation: Partial<Reservation> = {
    user: '',
    deviceId: '',
    borrowStartDate: undefined,
    borrowEndDate: undefined,
  };

  isDialogOpen: boolean = false; // État d'ouverture de la modal
  isEditing: boolean = false; // Détermine si on est en mode édition

  constructor(private reservationService: ReservationService, private router: Router) {}

  ngOnInit(): void {
    this.loadReservations(); // Charger les réservations au démarrage
  }

  // Charger toutes les réservations depuis Firebase
  loadReservations(): void {
    this.reservationService.getReservations().subscribe(
      (reservations) => {
        this.reservations = reservations;
        this.displayedReservations = reservations; // Affichage initial
      },
      (error) => {
        console.error('Erreur lors du chargement des réservations :', error);
        alert('Impossible de charger les réservations.');
      }
    );
  }

  // Filtrer les réservations en fonction du terme de recherche
  filterReservations(): void {
    this.displayedReservations = this.reservations.filter(
      (reservation) =>
        reservation.user?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        reservation.deviceId?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (reservation.borrowStartDate &&
          new Date(reservation.borrowStartDate).toLocaleDateString().includes(this.searchTerm)) ||
        (reservation.borrowEndDate &&
          new Date(reservation.borrowEndDate).toLocaleDateString().includes(this.searchTerm))
    );
  }

  // Ouvrir la modal pour ajouter ou modifier une réservation
  openDialog(reservation?: Reservation): void {
    this.isDialogOpen = true;
    this.isEditing = !!reservation; // Mode édition si une réservation est passée
    this.dialogReservation = reservation
      ? { ...reservation }
      : { user: '', deviceId: '', borrowStartDate: undefined, borrowEndDate: undefined }; // Nouvelle réservation
  }

  // Enregistrer une réservation (ajouter ou modifier)
  saveDialogReservation(): void {
    if (this.isEditing) {
      // Modification d'une réservation existante
      this.reservationService.updateReservation(this.dialogReservation.id!, this.dialogReservation as Reservation).then(
        () => {
          alert('Réservation modifiée avec succès !');
          this.loadReservations(); // Recharger la liste
          this.closeDialog();
        },
        (error) => {
          console.error('Erreur lors de la modification :', error);
          alert('Impossible de modifier cette réservation.');
        }
      );
    } else {
      // Ajout d'une nouvelle réservation
      this.reservationService.addReservation(this.dialogReservation as Reservation).then(
        () => {
          alert('Réservation ajoutée avec succès !');
          this.loadReservations(); // Recharger la liste
          this.closeDialog();
        },
        (error) => {
          console.error('Erreur lors de l\'ajout :', error);
          alert('Impossible d\'ajouter cette réservation.');
        }
      );
    }
  }

  // Fermer la modal
  closeDialog(): void {
    this.isDialogOpen = false;
    this.dialogReservation = { user: '', deviceId: '', borrowStartDate: undefined, borrowEndDate: undefined };
    this.isEditing = false;
  }

  // Supprimer une réservation
  deleteReservation(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      this.reservationService.deleteReservation(id).then(
        () => {
          alert('Réservation supprimée avec succès !');
          this.loadReservations(); // Recharger les réservations après suppression
        },
        (error) => {
          console.error('Erreur lors de la suppression :', error);
          alert('Impossible de supprimer cette réservation.');
        }
      );
    }
  }
}
