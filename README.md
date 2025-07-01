# JS VR

Ce projet est une démonstration de l'utilisation de l'API WebXR en JavaScript pour détecter et lancer des sessions de Réalité Virtuelle (VR) ou Augmentée (AR) dans le navigateur.

## Fonctionnalités principales
- Détection des capacités XR du navigateur (WebXR)
- Affichage des modes XR disponibles (VR, AR, Inline)
- Lancement et arrêt d'une session XR selon le mode choisi
- Interface utilisateur simple avec gestion dynamique des boutons et messages

## Structure du projet
```
JS VR/
├── assets/
│   ├── css/
│   │   ├── app.css
│   │   └── components/
│   │       ├── button.css
│   │       └── global.css
│   └── js/
│       ├── app.js
│       └── lib/
│           ├── init.js
│           └── utils.js
├── index.html
├── package.json
└── package-lock.json
```

- `index.html` : Page principale, charge le JS et le CSS.
- `assets/js/app.js` : Logique principale de l'application, gestion des sessions XR.
- `assets/js/lib/init.js` : Fonctions utilitaires pour vérifier et lancer les sessions XR.
- `assets/js/lib/utils.js` : Utilitaire pour l'exécution du code après chargement du DOM.
- `assets/css/app.css` et `components/` : Styles globaux et composants (boutons, etc).

## Prérequis
- Navigateur compatible WebXR (Chrome, Edge, etc.)
- Node.js installé

## Installation et lancement
1. Installez les dépendances :
   ```bash
   npm install
   ```
2. Lancez le serveur local :
   ```bash
   npm start
   ```
3. Ouvrez votre navigateur à l'adresse indiquée (par défaut http://localhost:8080)

## Utilisation
- La page affiche les modes XR disponibles sur votre appareil.
- Cliquez sur un mode disponible, puis sur le bouton pour démarrer la session XR.
- Cliquez à nouveau pour quitter la session.

## Licence
ISC

---
*Projet pédagogique pour l'exploration de la WebXR API en JavaScript.* 