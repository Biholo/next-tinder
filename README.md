# Tinder Clone

Une application de rencontre inspirée de Tinder, construite avec React, Node.js, et MongoDB.

## Technologies utilisées

- Frontend : React, TypeScript, TailwindCSS
- Mobile : React Native, Expo, TypeScript
- Backend : Node.js, Express, TypeScript
- Base de données : MongoDB
- Authentification : JWT
- WebSocket : Messages en temps réel
- Validation : Joi


## Installation

### Backend

```bash
cd backend
npm install
cp .env.example .env  # Configurez vos variables d'environnement
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env  # Configurez vos variables d'environnement
npm run dev
```

### Mobile (avec Expo)

```bash
cd mobile
npm install
cp .env.example .env  # Configurez vos variables d'environnement
npx expo start
```

## Données de test (Fixtures)

Pour peupler la base de données avec des données de test :

```bash
cd backend
npm run fixtures
```

Les fixtures créent deux comptes principaux qui sont déjà matchés ensemble :

1. Compte Admin :
   - Email: admin@ipssi.fr
   - Password: password
   - Genre: Homme
   - Age: 33 ans

2. Compte Test :
   - Email: marie@dupont.fr
   - Password: password
   - Genre: Femme
   - Age: 28 ans

Ces deux comptes ont déjà :
- Une possibilité de swipe
- Une conversation avec des messages
- Des photos de profil
- Des préférences configurées

## Pages

### 1. Login (/login)
- Connexion avec email/mot de passe
- Redirection automatique si déjà connecté
- Lien vers l'inscription

### 2. Register (/register)
- Inscription avec :
  - Email
  - Mot de passe
  - Informations personnelles (nom, prénom, date de naissance)
  - Préférences de matching

### 3. Profile (/profile)
- Affichage/modification des informations personnelles
- Gestion des photos (jusqu'à 5)
- Modification des préférences de matching
- Paramètres de compte

### 4. Swipping (/)
- Interface de swipe style Tinder
- Affichage des profils selon les préférences
- Actions : Like (swipe droite) / Dislike (swipe gauche)
- Notification de match en temps réel

### 5. Conversations (/chat/:matchId)
- Liste des matches
- Chat en temps réel
- Historique des messages
- Statut en ligne/hors ligne

## API Routes

### Auth Routes (/api/auth)
- POST /register - Inscription
- POST /login - Connexion
- POST /logout - Déconnexion
- GET /me - Profil utilisateur courant
- POST /refresh - Rafraîchir le token

### User Routes (/api/users)
- GET / - Récupérer les profils à swiper
- PATCH /me - Mettre à jour son profil
- POST /photos - Ajouter/Mettre à jour les photos de profil

### Swipe Routes (/api/swipes)
- POST / - Créer un swipe

### Match Routes (/api/matches)
- GET / - Liste des matches

### Message Routes (/api/messages)
- GET /:matchId - Messages d'un match

