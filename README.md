#   Présentation du projet

1. sujet: 

La Plateforme de Génération de Quiz Intelligent est une application backend permettant :

    - la gestion de cours pédagogiques ;

    - La génération automatique de quiz via IA ;

    - La correction automatique ;

    - Le suivi des performances des étudiants.

2. objetifs: 

    Le système a pour objectifs de :
    * automatiser la création de quiz pédagogiques ;
    * réduire le temps nécessaire à la création des exercices ;
    * améliorer la qualité des révisions ;
    * offrir une correction automatique rapide ;
    * permettre le suivi des performances des étudiants ;
    * exploiter l’intelligence artificielle dans le domaine éducatif.

3. utilisateurs:

    * Etudiant,
    * Administrateur

4. fonctionalites principales

    * Authentification
        - inscription ;
        - connexion ;
        - gestion des rôles ;
        - sécurisation via JWT et cookies.
    * Gestion des cours
        - création d’un cours ;
        - consultation des cours ;
        - modification ;
        - suppression.
    * Génération de quiz
        - génération automatique via IA ;
        - choix du nombre de questions ;
        - sélection des types de questions :
            -> QCM ;
            -> vrai/faux ;
            -> questions ouvertes.
    * Passage des quiz
        - affichage des questions ;
        - réponse aux questions ;
        - correction automatique ;
    * calcul du score final.
        - Historique et statistiques
        - consultation des anciens quiz ;
        - affichage des scores ;
        - suivi de progression ;
        - statistiques de réussite.

#    Architecture du projet

Backend/
│── prisma/
│   ├── schema.prisma
│   ├── migrations/
│── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   │   ├── env.js
│   │   ├── prisma.js
│   │   ├── jwt.js
│   ├── controllers/
│   ├── middlewares/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── validators/
│── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   ├── setup/
│── .env.example
│── docker-compose.yml
│── package.json

#   Installation

1.  Cloner le dépôt : `git clone <url-du-repo>`
2.  Naviguer dans le dossier du projet : `cd Backend`
3.  Installer les dépendances : `npm install` 
4.  Configurer les variables d’environnement
5.  Initialiser la base de données avec Prisma : `npx prisma migrate dev --name init`
6.  Démarrer le serveur : `npm start`

#   Docker

Le projet inclut un fichier `docker-compose.yml` permettant de lancer :
`PostgreSQL` et `Le backend Node.js`

1.  Lancer Docker : `docker-compose up --build`
2.  Arréter : `docker-compose down`

#   Variables d’environnement
| Variable | Description |
| ``PORT`` | Port du serveur |
| ``DATABASE_URL`` | URL PostgreSQL |
| ``JWT_SECRET`` | Secret JWT access |
| ``JWT_REFRESH_SECRET`` | Secret JWT refresh |
| ``GROQUERY_API_KEY`` | Clé API IA |

#   Endpoints API

1.  Authentification

| Méthode | Endpoint | Description |
| --- | --- | --- |
| POST | ``/auth/register`` | Inscription |
| POST | ``/auth/login`` | Connexion |
| POST | ``/auth/logout`` | Déconnexion |

2.  Cours 

| Méthode | Endpoint | Description |
| --- | --- | --- |
| POST | ``/courses`` | Créer un cours |
| GET | ``/courses`` | Lister les cours |
| GET | ``/courses/:id`` | Voir un cours |
| PUT | ``/courses/:id`` | Modifier un cours |
| DELETE | ``/courses/:id`` | Supprimer un cours |

3.  Quiz

| Méthode | Endpoint | Description |
| --- | --- | --- |
| POST | ``/quiz/generate`` | Générer un quiz via IA |
| GET | ``/quiz`` | Lister les quiz |
| GET | ``/quiz/:id`` | Voir un quiz |
| POST | ``/quiz/:id/answer`` | Répondre au quiz |
| POST | ``/quiz/:id/correct`` | Correction automatique |

#   Statégie de tests

1.  Tests unitaires 
        - Services
        - Validators
        - Utils

2.  Tests d'intégration 
        - Routes
        - Middlewares
        - Repositories

3    Tests E2E
        - API complète
        - Base de données réelle
        - Scénarios utilisateur

Lancer les tests : `npm test`

#   CI/CD

Pipeline recommandé :
    - Lint + Tests unitaires
    - Tests d’intégration
    - Build Docker
    - Déploiement automatique (Railway, Render, Docker Hub, VPS…)
Exemple GitHub Actions : `.github/workflows/ci.yml`

#   Déploiement 

Ajouter ici :
    - URL API (Production) 
    - URL Swagger (Si disponible)
    - URL documentation
Exemple : `https://quiz-intelligent-api.example.com`
