import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:4200", // Définition de l'URL de base pour éviter de la répéter
    setupNodeEvents(on, config) {
      // Implémentation des événements si nécessaire
    },
    defaultCommandTimeout: 8000, // Augmente le temps d'attente des commandes
    retries: 2, // Nombre de tentatives en cas d'échec d'un test
    viewportWidth: 1280, // Largeur de l'écran pour les tests
    viewportHeight: 720, // Hauteur de l'écran pour les tests
  },
});
