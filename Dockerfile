# Utilisation de l'image Node.js officielle
FROM node:18 AS build

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier le fichier package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tous les fichiers du projet dans le conteneur
COPY . .

# Construire le projet Angular
RUN npm run build --prod

# Utiliser un serveur web pour servir l'application
FROM nginx:alpine

# Copier les fichiers build du conteneur précédent dans le répertoire Nginx
COPY --from=build /app/dist/locaMat /usr/share/nginx/html


# Exposer le port 80
EXPOSE 80

# Démarrer Nginx pour servir l'application Angular
CMD ["nginx", "-g", "daemon off;"]
