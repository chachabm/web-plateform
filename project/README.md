# LearnMe - Plateforme d'Apprentissage des Langues

Une plateforme complète d'apprentissage des langues construite avec React, TypeScript et Node.js.

## 🚀 Fonctionnalités

### Pour les Étudiants
- **Accès Gratuit** : Tous les cours et fonctionnalités sont entièrement gratuits
- **Apprentissage Interactif** : Leçons vidéo avec suivi des progrès
- **Chat en Temps Réel** : Communiquez avec les instructeurs et pairs
- **Ressources Téléchargeables** : Accédez aux matériaux hors ligne
- **Certificats** : Obtenez des certificats de completion
- **Système de Quiz** : Testez vos connaissances avec des quiz interactifs
- **Messagerie** : Système de commentaires et messagerie intégré

### Pour les Instructeurs
- **Création de Cours** : Construisez des cours de langues complets
- **Sessions Vidéo** : Organisez des sessions d'enseignement en direct
- **Gestion des Étudiants** : Suivez les progrès et l'engagement des étudiants
- **Analyses** : Surveillez les performances des cours et les commentaires des étudiants
- **Partage de Ressources** : Téléchargez et partagez des matériaux d'apprentissage

### Pour les Administrateurs
- **Gestion de Plateforme** : Supervisez tous les cours et utilisateurs
- **Tableau de Bord Analytics** : Surveillez les statistiques à l'échelle de la plateforme
- **Gestion des Utilisateurs** : Gérez les comptes étudiants et instructeurs
- **Modération de Contenu** : Révisez et approuvez le contenu des cours

## 🛠 Stack Technologique

### Frontend
- **React 18** avec TypeScript
- **Tailwind CSS** pour le style
- **React Router** pour la navigation
- **Lucide React** pour les icônes
- **Vite** pour le développement et la construction

### Backend
- **Node.js** avec Express
- **MongoDB** avec Mongoose
- **Authentification JWT**
- **Nodemailer** pour les notifications email
- **Bcrypt** pour le hachage des mots de passe
- **Express Validator** pour la validation des entrées

## 📦 Installation et Configuration

### Prérequis
- Node.js (v18 ou supérieur)
- MongoDB (instance locale ou cloud)
- Gestionnaire de paquets npm ou yarn

### 1. Cloner le Dépôt
```bash
git clone <repository-url>
cd learnme-platform
```

### 2. Installer les Dépendances

#### Dépendances Frontend
```bash
npm install
```

#### Dépendances Backend
```bash
cd server
npm install
```

### 3. Configuration de l'Environnement

Créez un fichier `.env` dans le répertoire `server` :

```env
# Base de données
MONGODB_URI=mongodb://localhost:27017/learnme-platform
MONGODB_URI_TEST=mongodb://localhost:27017/learnme-platform-test

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Serveur
PORT=5000
NODE_ENV=development

# Configuration Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# URL Frontend
CLIENT_URL=http://localhost:5173
```

### 4. Configuration de la Base de Données

Assurez-vous que MongoDB fonctionne sur votre système :

```bash
# Pour macOS avec Homebrew
brew services start mongodb-community

# Pour Ubuntu/Debian
sudo systemctl start mongod

# Pour Windows
net start MongoDB
```

### 5. Démarrer l'Application

#### Mode Développement (Recommandé)
```bash
# Démarrer frontend et backend simultanément
npm run dev
```

#### Démarrage Manuel
```bash
# Terminal 1 : Démarrer le backend
cd server
npm run dev

# Terminal 2 : Démarrer le frontend
npm run client
```

### 6. Accéder à l'Application

- **Frontend** : http://localhost:5173
- **API Backend** : http://localhost:5000
- **Vérification Santé API** : http://localhost:5000/api/health

## 🔧 Options de Configuration

### Modes d'Authentification

#### Mode Démo (Actuel)
- Utilise localStorage pour le stockage temporaire des comptes
- Pas de persistance réelle en base de données
- Adapté pour les tests et démonstrations
- **Activé par défaut** - Changez `DEMO_MODE = false` dans `AuthContext.tsx` pour utiliser le vrai backend

#### Mode Production (Recommandé)
- Persistance réelle en base de données avec MongoDB
- Authentification basée sur JWT
- Notifications email
- Hachage sécurisé des mots de passe

Pour activer le mode production, mettez à jour `DEMO_MODE = false` dans `AuthContext.tsx`.

### Configuration Email

Pour que les notifications email fonctionnent :

1. **Configuration Gmail** :
   - Activez l'authentification à 2 facteurs
   - Générez un mot de passe spécifique à l'application
   - Utilisez le mot de passe de l'application dans `EMAIL_PASS`

2. **Autres Fournisseurs Email** :
   - Mettez à jour `EMAIL_HOST` et `EMAIL_PORT`
   - Configurez les identifiants d'authentification

## 📚 Documentation API

### Points de Terminaison d'Authentification
- `POST /api/auth/register` - Créer un nouveau compte
- `POST /api/auth/login` - Connexion utilisateur
- `GET /api/auth/me` - Obtenir l'utilisateur actuel
- `POST /api/auth/logout` - Déconnexion utilisateur

### Points de Terminaison des Cours
- `GET /api/courses` - Obtenir tous les cours
- `GET /api/courses/:id` - Obtenir un cours spécifique
- `POST /api/courses` - Créer un nouveau cours (instructeur/admin)
- `POST /api/courses/:id/enroll` - S'inscrire à un cours

### Points de Terminaison Utilisateur
- `GET /api/users/profile` - Obtenir le profil utilisateur
- `PUT /api/users/profile` - Mettre à jour le profil utilisateur
- `GET /api/enrollments` - Obtenir les inscriptions utilisateur

## 🎯 Persistance des Comptes

### Implémentation Actuelle (Mode Démo)
- **Mode Démo** : Comptes stockés dans localStorage du navigateur
- **Perte de Données** : Effacés quand le cache du navigateur est vidé
- **Adapté Pour** : Tests et démonstrations
- **Connexion Facile** : Utilisez n'importe quel email/mot de passe pour vous connecter

### Implémentation Production
- **Base de Données Réelle** : Comptes sauvegardés dans MongoDB
- **Persistant** : Les données survivent aux sessions du navigateur
- **Sécurisé** : Hachage des mots de passe et tokens JWT
- **Notifications Email** : Emails de bienvenue et confirmations

### Activer la Vraie Persistance

1. **Démarrer le service MongoDB**
2. **Configurer les variables** d'environnement dans `.env`
3. **Mettre à jour AuthContext** pour utiliser `DEMO_MODE = false`
4. **Tester l'inscription** - les comptes seront sauvegardés de façon permanente

## 🔒 Fonctionnalités de Sécurité

- **Hachage des Mots de Passe** : Bcrypt avec rounds de salt
- **Authentification JWT** : Auth basée sur des tokens sécurisés
- **Validation des Entrées** : Validation côté serveur
- **Limitation de Taux** : Prévenir les abus
- **Protection CORS** : Configurée pour la sécurité
- **Helmet** : En-têtes de sécurité

## 📱 Aperçu des Fonctionnalités

### Expérience Étudiant
1. **Inscription Gratuite** : Créez un compte instantanément
2. **Navigation des Cours** : Explorez tous les cours disponibles
3. **Inscription Instantanée** : Commencez à apprendre immédiatement
4. **Suivi des Progrès** : Surveillez vos progrès d'apprentissage
5. **Chat Interactif** : Posez des questions et obtenez de l'aide
6. **Téléchargements de Ressources** : Accédez aux matériaux hors ligne
7. **Certificats** : Obtenez des certificats de completion
8. **Système de Messagerie** : Communiquez avec instructeurs et pairs

### Expérience Instructeur
1. **Création de Cours** : Construisez des cours complets
2. **Gestion Vidéo** : Téléchargez et organisez les leçons
3. **Sessions en Direct** : Organisez des sessions d'enseignement en temps réel
4. **Analytics Étudiants** : Suivez les progrès des étudiants
5. **Partage de Ressources** : Fournissez des matériaux téléchargeables
6. **Communication** : Chattez avec les étudiants

### Expérience Admin
1. **Aperçu de la Plateforme** : Surveillez toutes les activités
2. **Gestion des Utilisateurs** : Gérez tous les comptes
3. **Modération des Cours** : Révisez et approuvez le contenu
4. **Tableau de Bord Analytics** : Statistiques à l'échelle de la plateforme
5. **Configuration Système** : Gérez les paramètres de la plateforme

## 🚀 Déploiement

### Déploiement Frontend
```bash
npm run build
# Déployez le dossier 'dist' sur votre fournisseur d'hébergement
```

### Déploiement Backend
1. **Variables d'Environnement** : Configurez l'environnement de production
2. **Base de Données** : Configurez MongoDB Atlas ou similaire
3. **Service Email** : Configurez le service email de production
4. **Sécurité** : Mettez à jour les paramètres CORS et de sécurité

## 🤝 Contribution

1. Forkez le dépôt
2. Créez une branche de fonctionnalité
3. Effectuez vos modifications
4. Testez minutieusement
5. Soumettez une pull request

## 📄 Licence

Ce projet est sous licence MIT.

## 🆘 Support

Pour le support et les questions :
- Créez une issue dans le dépôt
- Contactez l'équipe de développement
- Consultez la documentation

---

**LearnMe** - Rendre l'apprentissage des langues accessible à tous, partout. 🌍📚

## 🔧 Résolution des Problèmes

### Problème : Impossible d'accéder au site après authentification

**Solution** : Le système est actuellement en mode démo. Utilisez n'importe quel email et mot de passe pour vous connecter. Les comptes sont créés automatiquement et stockés localement.

**Comptes de Test Suggérés** :
- Étudiant : `etudiant@test.com` / `password`
- Instructeur : `instructor@test.com` / `password`  
- Admin : `admin@test.com` / `password`

### Problème : Serveur backend non disponible

**Solution** : En mode démo, le backend n'est pas requis. Tous les comptes fonctionnent automatiquement. Pour utiliser le vrai backend, démarrez le serveur avec `cd server && npm run dev`.