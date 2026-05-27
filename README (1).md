# QuizAI — Plateforme de Génération de Quiz Intelligent

> Application fullstack de génération automatique de quiz pédagogiques via IA, avec backend Node.js/Express, frontend Next.js et build mobile Android via Capacitor.

---

## Sommaire

- [Présentation](#présentation)
- [Stack technique](#stack-technique)
- [Architecture du projet](#architecture-du-projet)
- [Modèle de données](#modèle-de-données)
- [Installation locale](#installation-locale)
- [Variables d'environnement](#variables-denvironnement)
- [Endpoints API](#endpoints-api)
- [Documentation Swagger](#documentation-swagger)
- [Tests](#tests)
- [Build mobile Android (Capacitor)](#build-mobile-android-capacitor)
- [CI/CD](#cicd)
- [Déploiement](#déploiement)

---

## Présentation

QuizAI est une plateforme pédagogique permettant à des étudiants de générer automatiquement des quiz à partir de leurs cours, puis de les passer et d'obtenir une correction instantanée. L'IA (Groq) analyse le contenu du cours fourni et produit des questions adaptées au niveau et à la matière.

**Utilisateurs :**
- **Étudiant** — crée des cours, génère et passe des quiz, consulte ses scores et son historique.
- **Administrateur** — gère les utilisateurs, supervise la plateforme.

**Fonctionnalités principales :**
- Inscription, connexion, gestion de session via JWT + cookies HttpOnly
- Génération de quiz par IA (QCM, Vrai/Faux, questions ouvertes)
- Choix du nombre de questions et des types
- Correction automatique et calcul du score
- Historique des quiz et suivi de progression
- Interface d'administration (liste, suppression d'utilisateurs)
- Documentation API interactive (Swagger UI)
- Build APK Android automatisé (Docker local ou GitHub Actions)

---

## Stack technique

| Couche | Technologie |
|---|---|
| Backend | Node.js, Express.js (ESM) |
| Base de données | PostgreSQL + Prisma ORM |
| Authentification | JWT (access 15min / refresh 7j), cookies HttpOnly |
| IA | Groq API |
| Validation | Zod |
| Documentation | Swagger UI (swagger-jsdoc) |
| Frontend | Next.js 14 (App Router), TypeScript, CSS Modules |
| Mobile | Capacitor + Android SDK |
| Conteneurisation | Docker, Docker Compose |
| CI/CD | GitHub Actions |
| Tests | Jest (unitaires + intégration), Cucumber (BDD E2E) |

---

## Architecture du projet

```
Node_js_cours/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── build-android.yml
│
├── Backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed/
│   │   │   ├── seed.js
│   │   │   └── data.json
│   │   └── migrations/
│   ├── src/
│   │   ├── app.js                      # Express + middlewares globaux
│   │   ├── server.js                   # Point d'entrée, écoute HTTP
│   │   ├── config/
│   │   │   ├── env.js                  # Validation des variables d'env (Zod)
│   │   │   ├── jwt.js                  # Sign / verify tokens
│   │   │   ├── prisma.js               # Instance Prisma Client
│   │   │   └── swagger.js              # Configuration Swagger UI
│   │   ├── controllers/
│   │   │   ├── admin.controller.js
│   │   │   ├── auth.controller.js
│   │   │   └── quiz.controller.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js      # Vérification JWT (cookie ou header)
│   │   │   ├── role.middleware.js      # Contrôle d'accès par rôle
│   │   │   └── validate.middleware.js  # Validation Zod des requêtes
│   │   ├── repositories/
│   │   │   ├── answer.repository.js
│   │   │   ├── auth.repository.js
│   │   │   ├── course.repository.js
│   │   │   └── quiz.repository.js
│   │   ├── routes/
│   │   │   ├── index.js
│   │   │   ├── admin.routes.js
│   │   │   ├── auth.routes.js
│   │   │   └── quiz.routes.js
│   │   ├── services/
│   │   │   ├── auth.service.js
│   │   │   ├── grok.service.js         # Intégration Groq API
│   │   │   ├── quiz.service.js
│   │   │   └── user.service.js
│   │   └── validators/
│   │       ├── auth.validator.js
│   │       └── quiz.validator.js
│   ├── tests/
│   │   ├── unit/
│   │   ├── integration/
│   │   ├── e2e/
│   │   ├── features/                   # Scénarios BDD Cucumber
│   │   └── setup/
│   ├── .env
│   ├── .env.example
│   ├── babel.config.json
│   ├── jest.config.js
│   ├── nodemon.json
│   ├── package.json
│   └── vercel.json
│
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── QuizApp.tsx
│   │   ├── UploadPhase.tsx
│   │   ├── LoadingPhase.tsx
│   │   └── ResultsPhase.tsx
│   ├── lib/
│   │   ├── config.ts                   # Configuration (URL API, etc.)
│   │   ├── fetchWithAuth.ts            # Fetch avec gestion des tokens
│   │   └── types.ts                    # Types TypeScript partagés
│   ├── modules/                        # CSS Modules par composant
│   │   ├── AdminPage.module.css
│   │   ├── Customselect.module.css
│   │   ├── DashboardPage.module.css
│   │   ├── LandingPage.module.css
│   │   ├── LoadingPhase.module.css
│   │   ├── LoginPage.module.css
│   │   ├── QuizApp.module.css
│   │   ├── QuizPhase.module.css
│   │   ├── RegisterPage.module.css
│   │   ├── ResultsPhase.module.css
│   │   └── UploadPhase.module.css
│   ├── public/
│   ├── .env
│   ├── .env.example
│   ├── next.config.ts
│   ├── next-env.d.ts
│   ├── package.json
│   ├── postcss.config.mjs
│   └── tsconfig.json
│
├── .env
├── .env.example
├── .gitignore
├── docker-compose.yml
├── docker-compose.dev.yml
├── doc.md
└── README.md
```

---

## Modèle de données

```
USER (1) ──── (N) COURSE
USER (1) ──── (N) QUIZ
USER (1) ──── (N) ANSWER
COURSE (1) ── (N) QUIZ
QUIZ (1) ──── (N) QUESTION
QUIZ (1) ──── (N) ANSWER
QUESTION (1) ─(N) ANSWER
```

---

## Installation locale

### Prérequis

- Node.js >= 20
- PostgreSQL
- Docker Desktop (optionnel, pour la base ou le build mobile)

### Backend

```bash
# 1. Cloner le dépôt
git clone <url-du-repo>
cd Backend

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos valeurs

# 4. Appliquer les migrations Prisma
npx prisma migrate dev --name init

# 5. (Optionnel) Seeder la base de données
npx prisma db seed

# 6. Démarrer le serveur
npm run dev      # mode développement
npm start        # mode production
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Le frontend est accessible sur `https://node-js-cours-m4jn.vercel.app`.  
Le backend écoute sur le port défini dans `.env` (défaut : `5000`).

### Avec Docker (base de données uniquement)

```bash
# À la racine du projet
docker-compose up -d   # Lance PostgreSQL en arrière-plan

# En mode développement
docker-compose -f docker-compose.dev.yml up -d
```

---

## Variables d'environnement

### Backend — `Backend/.env`

Créez un fichier `.env` en vous basant sur `Backend/.env.example` :

| Variable | Description | Exemple |
|---|---|---|
| `PORT` | Port d'écoute du serveur | `5000` |
| `DATABASE_URL` | URL de connexion PostgreSQL | `postgresql://quiz_app_user:o2WIZIjQXjGvlOzQ9ZFJagP9gMWwbeuw@dpg-d87gsjtckfvc73a89150-a.oregon-postgres.render.com/quiz_app_s69p` |
| `JWT_SECRET` | Secret pour les access tokens | chaîne aléatoire longue |
| `JWT_REFRESH_SECRET` | Secret pour les refresh tokens | chaîne aléatoire longue |
| `GROQUERY_API_KEY` | Clé API Groq | `gsk_...` |
| `FRONTEND_URL` | URL du frontend (CORS) | `https://node-js-cours-m4jn.vercel.app` |

> Les tokens d'accès expirent après **15 minutes**, les refresh tokens après **7 jours**.

### Frontend — `frontend/.env`

| Variable | Description | Exemple |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | URL du backend | `https://backend-quizz-g9az.onrender.com` |

---

## Endpoints API

Tous les endpoints sont préfixés par `/api`.

### Authentification

| Méthode | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Non | Inscription |
| `POST` | `/api/auth/login` | Non | Connexion |
| `POST` | `/api/auth/logout` | Oui | Déconnexion (efface les cookies) |
| `POST` | `/api/auth/refresh` | Non | Renouvellement du token d'accès |
| `GET` | `/api/auth/me` | Oui | Profil de l'utilisateur connecté |

### Quiz

| Méthode | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/quiz/generate` | Oui | Générer un quiz via IA |
| `POST` | `/api/quiz/generate/course/:courseId` | Oui | Générer un quiz pour un cours existant |
| `POST` | `/api/quiz/:quizId/submit` | Oui | Soumettre les réponses et obtenir le score |
| `GET` | `/api/quiz/me` | Oui | Lister mes quiz |
| `GET` | `/api/quiz/course/:courseId` | Oui | Quiz liés à un cours |

### Administration

| Méthode | Endpoint | Auth | Rôle | Description |
|---|---|---|---|---|
| `GET` | `/api/admin/dashboard` | Oui | ADMIN | Tableau de bord |
| `GET` | `/api/admin/users` | Oui | ADMIN | Liste des utilisateurs |
| `GET` | `/api/admin/users/:id` | Oui | ADMIN | Détail d'un utilisateur |
| `DELETE` | `/api/admin/users/:id` | Oui | ADMIN | Supprimer un utilisateur |

### Exemple de corps — Générer un quiz

```json
{
  "course": {
    "title": "Introduction JavaScript",
    "content": "JavaScript est un langage de programmation...",
    "subject": "Programmation",
    "level": "debutant"
  },
  "quizConfig": {
    "questionCount": 10,
    "selectedTypes": ["qcm", "vf"]
  }
}
```

---

## Documentation Swagger

La documentation interactive est disponible à l'adresse :

```
http://localhost:3000/docs
```

Elle liste tous les endpoints avec leurs paramètres, corps de requête et réponses attendues. L'authentification se fait via le cookie `accessToken` (posé automatiquement après login).

---

## Tests

Le projet comporte trois niveaux de tests.

```bash
# Depuis Backend/

# Lancer tous les tests
npm test

# Tests unitaires uniquement
npm run test:unit

# Tests d'intégration
npm run test:integration

# Tests E2E (Cucumber BDD)
npm run test:e2e
```

| Niveau | Couverture |
|---|---|
| Unitaires | Services, validators |
| Intégration | Routes, middlewares, repositories |
| E2E (BDD) | Scénarios utilisateur complets sur base réelle |

Les scénarios BDD sont écrits en Gherkin dans `Backend/tests/features/` (ex : `auth.feature`).

---

## Build mobile Android (Capacitor)

Le frontend Next.js peut être packagé en application Android native grâce à Capacitor. Deux approches sont disponibles.

### Prérequis communs

Dans `frontend/next.config.ts`, l'export statique doit être activé :

```ts
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};
```

Initialiser Capacitor une première fois depuis `frontend/` :

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init
# App name    : QuizAI
# Package ID  : com.keyce.quizai
# Web dir     : out
```

### Approche A — Build Docker local

Nécessite uniquement Docker Desktop. L'image contient Java 17, Node.js 20, Android SDK 34 et Gradle.

```bash
# À la racine du projet
chmod +x scripts/build-android.sh
./scripts/build-android.sh
```

L'APK est généré dans `generated/builds/apk/app-debug.apk`.

Premier build : 20 à 30 min (téléchargement du SDK).  
Builds suivants : 2 à 5 min (cache Gradle).

### Approche B — GitHub Actions (CI/CD)

Chaque `git push` sur `main` ou `develop` déclenche un runner Ubuntu qui compile l'APK dans le cloud.

```bash
git add .
git commit -m "feat: mise à jour"
git push
```

L'APK est disponible dans **GitHub → Actions → workflow terminé → Artifacts** pendant 30 jours.

### Installer l'APK sur Android

Via câble USB (mode développeur activé) :

```bash
adb devices
adb install generated/builds/apk/app-debug.apk
```

Via transfert de fichier : copiez `app-debug.apk` sur l'appareil et ouvrez-le. Activez "Sources inconnues" si nécessaire dans les paramètres de sécurité.

---

## CI/CD

### Pipeline CI (`ci.yml`)

Déclenché à chaque push :

1. Lint + tests unitaires
2. Tests d'intégration
3. Build Docker (backend)
4. Déploiement automatique

### Pipeline mobile (`build-android.yml`)

Déclenché sur push vers `main` / `develop` ou manuellement :

1. Checkout du code
2. Configuration Node.js 20, Java 17, Android SDK 34
3. `npm ci` + `next build` (export statique)
4. `cap sync android`
5. `./gradlew assembleDebug`
6. Upload de l'APK en artefact GitHub (rétention 30 jours)

---

## Déploiement

| Élément | URL |
|---|---|
| Frontend (Vercel) | https://node-js-cours-vuxo.vercel.app/ |
| Backend | https://backend-quizz-g9az.onrender.com |
| Swagger (prod) |  |

Le backend peut être déployé sur Railway, Render, ou tout VPS avec Docker. La base PostgreSQL doit être accessible via `DATABASE_URL`.
