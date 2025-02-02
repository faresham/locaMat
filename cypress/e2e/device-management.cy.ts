/// <reference types="cypress" />

describe('Device Management - Tests', () => {
    beforeEach(() => {
        cy.visit('/admin/device-management');
        cy.wait(2000);
    });

    // CT101 - Vérification du bouton "Ajouter un matériel"
    it('CT101 - Vérification du bouton "Ajouter un matériel"', () => {
        cy.get('.add-device-btn').should('be.visible');
    });

    // CT103 - Création réussie
    it('CT103 - Ajout de matériel via la modale', () => {
        cy.get('.add-device-btn').click();
        cy.get('.modal-content', { timeout: 5000 }).should('be.visible');
        cy.get('.modal-content input[name="name"]').type('Test Device');
        cy.get('.modal-content input[name="reference"]').type('AN123');
        cy.get('.modal-content input[name="version"]').type('1.0');
        cy.get('.modal-content input[name="phoneNumber"]').type('0123456789', { force: true });
        cy.get('.modal-content button').contains('Enregistrer').click();
        cy.wait(2000);
        cy.get('table.device-table').contains('Test Device').should('be.visible');
    });

    // CT301 - Vérification du bouton "Modifier" sur la page
    it('CT301 - Vérification du bouton "Modifier" sur la page', () => {
        cy.get('table.device-table').contains('Test Device').parent().find('button[aria-label="Modifier"]').click({ force: true });
        cy.wait(1000);
        cy.get('span.mdc-button__label').contains('Modifier').click({ force: true });
    });

    // CT302 - Suppression réussie de matériel
    it('CT302 - Suppression réussie de matériel', () => {
        cy.get('table.device-table').contains('Test Device').parent().find('button[aria-label="Supprimer"]').click({ force: true });
        cy.wait(1000);
        cy.on('window:confirm', () => true);
        cy.wait(2000);
        cy.get('table.device-table').contains('Test Device').should('not.exist');
    });

    // CT503 - Vérification du message "Aucun matériel trouvé"
    it('CT503 - Vérification du message "Aucun matériel trouvé"', () => {
        cy.get('.search-field input').type('Test Device');
        cy.wait(1000);
        cy.contains('Aucun matériel trouvé.', { timeout: 5000 }).should('be.visible');
    });
});