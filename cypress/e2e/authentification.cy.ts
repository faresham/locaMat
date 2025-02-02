/// <reference types="cypress" />

describe('Auth Component - Login Tests', () => {
    beforeEach(() => {
      cy.visit('/login');
      cy.wait(2000);
    });

    // CT001-AUTHENTIFICATION
    it('CT001 - doit se connecter avec des identifiants valides', () => {
      cy.get('input[name="email"]').type('user@user.com');
      cy.get('input[name="password"]').type('password');
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/home');
    });

    // CT002-AUTHENTIFICATION AVEC MDP KO
    it('CT002 - doit afficher une erreur pour un mot de passe incorrect', () => {
      cy.get('input[name="email"]').type('user@user.com');
      cy.get('input[name="password"]').type('wrongpassword');
      cy.get('button[type="submit"]').click();
      cy.get('.error-message').should('be.visible');
    });

    // CT003-AUTHENTIFICATION AVEC ID KO
    it('CT003 - doit afficher une erreur pour un email incorrect', () => {
      cy.get('input[name="email"]').type('wrong@user.com');
      cy.get('input[name="password"]').type('password');
      cy.get('button[type="submit"]').click();
      cy.get('.error-message').should('be.visible');
    });

    // CT004-AUTHENTIFICATION AVEC ID et MDP KO
    it('CT004 - doit afficher une erreur pour un email et un mot de passe incorrects', () => {
      cy.get('input[name="email"]').type('wrong@user.com');
      cy.get('input[name="password"]').type('wrongpassword');
      cy.get('button[type="submit"]').click();
      cy.get('.error-message').should('be.visible');
    });

    // CT005-AUTHENTIFICATION AVEC ID INCONNU
    it('CT005 - doit afficher une erreur pour un email inconnu', () => {
      cy.get('input[name="email"]').type('unknown@user.com');
      cy.get('input[name="password"]').type('password');
      cy.get('button[type="submit"]').click();
      cy.get('.error-message').should('be.visible');
    });

    // CT006-AUTHENTIFICATION AVEC 2 CHAMPS VIDES
    it('CT006 - doit afficher une erreur pour des champs email et mot de passe vides', () => {
      cy.get('button[type="submit"]').click();
      cy.get('.error-message').should('be.visible');
    });

    // CT007-AUTHENTIFICATION AVEC ID REMPLI - MDP VIDE
    it('CT007 - doit afficher une erreur pour un mot de passe vide', () => {
      cy.get('input[name="email"]').type('user@user.com');
      cy.get('button[type="submit"]').click();
      cy.get('.error-message').should('be.visible');
    });

    // CT008-AUTHENTIFICATION AVEC ID VIDE - MDP REMPLI
    it('CT008 - doit afficher une erreur pour un email vide', () => {
      cy.get('input[name="password"]').type('password');
      cy.get('button[type="submit"]').click();
      cy.get('.error-message').should('be.visible');
    });

    // CT009-AUTHENTIFICATION AVEC MAJUSCULES/MINUSCULES ERRONÉES DANS LE MDP
    it('CT009 - doit afficher une erreur pour un mot de passe avec une casse incorrecte', () => {
      cy.get('input[name="email"]').type('user@user.com');
      cy.get('input[name="password"]').type('PASSWORD');
      cy.get('button[type="submit"]').click();
      cy.get('.error-message').should('be.visible');
    });
  
  });
