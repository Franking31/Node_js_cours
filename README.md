# DOCUMENTATION DU PROJET

## 📑 Sommaire

- [Présentation du projet](#présentation-du-projet)
- [Architecture](#architecture-du-projet)
- [Installation](#installation)
- [Docker](#docker)
- [Variables d’environnement](#variables-denvironnement)
- [Endpoints API](#endpoints-api)
- [Stratégie de tests](#stratégie-de-tests)
- [CI/CD](#cicd)
- [Déploiement](#déploiement)


## Presentqtion du projet 

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
##    User stories Etudiant
1. Inscription

    En tant qu’étudiant
    Je veux créer un compte
    Afin d’accéder à la plateforme.

2. Connexion

    En tant qu’étudiant
    Je veux me connecter
    Afin d’utiliser les fonctionnalités du système.

3. Ajout de cours

    En tant qu’étudiant
    Je veux enregistrer un cours
    Afin de générer un quiz à partir de celui-ci.

4. Génération automatique

    En tant qu’étudiant
    Je veux générer automatiquement un quiz
    Afin d’évaluer mes connaissances.

5. Personnalisation du quiz

    En tant qu’étudiant
    Je veux choisir le type et le nombre de questions
    Afin d’obtenir un quiz adapté à mes besoins.

6. Réponse au quiz

    En tant qu’étudiant
    Je veux répondre aux questions
    Afin de tester mon niveau de compréhension.

7. Correction automatique

    En tant qu’étudiant
    Je veux obtenir une correction automatique
    Afin de connaître immédiatement mes résultats.

8. Consultation des scores

    En tant qu’étudiant
    Je veux consulter mes scores
    Afin de suivre ma progression.

9. Historique des quiz

    En tant qu’étudiant
    Je veux voir mes anciens quiz
    Afin de réviser mes erreurs précédentes.

##  User Stories Administrateur
10. Gestion des utilisateurs

En tant qu’administrateur
Je veux gérer les utilisateurs
Afin d’assurer le bon fonctionnement du système.

11. Supervision des activités

En tant qu’administrateur
Je veux consulter les activités de la plateforme
Afin de surveiller l’utilisation du système.

12. Consultation des statistiques

En tant qu’administrateur
Je veux consulter les statistiques globales
Afin d’analyser les performances générales des utilisateurs.

#   Criteres d'acceptation
1. User Story : Création de compte
    - Critères d’acceptation
    - le nom est obligatoire ;
    - l’email est obligatoire ;
    - l’email doit être valide ;
    - le mot de passe doit contenir au moins 8 caractères ;
    - l’email doit être unique ;
    - un message d’erreur doit être affiché si l’email existe déjà ;
    - l’utilisateur est automatiquement connecté après inscription ;
    - un token JWT est généré après inscription.
2. User Story : Connexion utilisateur
    - Critères d’acceptation
    - l’email est obligatoire ;
    - le mot de passe est obligatoire ;
    - l’email doit exister dans le système ;
    - le mot de passe doit être correct ;
    - un message d’erreur est affiché si les identifiants sont invalides ;
    - un token JWT est généré après connexion ;
    - l’utilisateur est redirigé vers son tableau de bord après connexion.
3. User Story : Ajouter un cours
    - Critères d’acceptation
    - le titre du cours est obligatoire ;
    - le contenu du cours est obligatoire ;
    - la matière est obligatoire ;
    - le niveau académique est obligatoire ;
    - le contenu doit contenir un nombre minimal de caractères ;
    - le cours est enregistré en base de données ;
    - un message de succès est affiché après enregistrement.
4. User Story : Modifier un cours
    - Critères d’acceptation
    - seul le propriétaire du cours peut le modifier ;
    - les champs modifiés doivent être validés ;
    - le cours mis à jour est sauvegardé en base ;
    - un message de confirmation est affiché ;
    - un message d’erreur est affiché si le cours n’existe pas.
5. User Story : Supprimer un cours
    - Critères d’acceptation
    - seul le propriétaire peut supprimer son cours ;
    - les quiz liés au cours sont également supprimés ;
    - une confirmation est demandée avant suppression ;
    - un message de succès est affiché après suppression.
6. User Story : Générer un quiz
    - Critères d’acceptation
    - le cours doit exister ;
    - le nombre de questions doit être compris entre 5 et 30 ;
    - au moins un type de question doit être sélectionné ;
    - le système appelle le service d’intelligence artificielle ;
    - les questions générées sont enregistrées en base ;
    - le quiz est associé à l’utilisateur connecté ;
    - un message d’erreur est affiché si la génération échoue.
7. User Story : Répondre à un quiz
    - Critères d’acceptation
    - l’utilisateur doit être authentifié ;
    - le quiz doit être actif ;
    - chaque réponse doit être liée à une question existante ;
    - les réponses sont enregistrées en base ;
    - l’utilisateur ne peut pas répondre deux fois à la même question ;
    - un message d’erreur est affiché si une réponse est invalide.
8. User Story : Correction automatique du quiz
    - Critères d’acceptation
    - le système compare les réponses de l’utilisateur avec les bonnes réponses ;
    - le score est calculé automatiquement ;
    - le pourcentage de réussite est enregistré ;
    - le statut du quiz passe à “DONE” après correction ;
    - le résultat final est affiché à l’utilisateur.
9. User Story : Consulter l’historique des quiz
    - Critères d’acceptation
    - seuls les quiz de l’utilisateur connecté sont affichés ;
    - les quiz sont triés du plus récent au plus ancien ;
    - le score et la date du quiz sont visibles ;
    - l’utilisateur peut consulter les détails d’un ancien quiz.
10. User Story : Consulter les statistiques
    - Critères d’acceptation
    - le système calcule le score moyen ;
    - le nombre total de quiz est affiché ;
    - les statistiques sont mises à jour après chaque quiz ;    
    - les résultats sont visibles uniquement par l’utilisateur concerné ou l’administrateur.
11. User Story : Gestion des utilisateurs par l’administrateur
    - Critères d’acceptation
    - seul un administrateur peut accéder à cette fonctionnalité ;
    - la liste des utilisateurs est affichée ;
    - l’administrateur peut supprimer un utilisateur ;
    - un message de confirmation est affiché après suppression ;
    - les accès non autorisés retournent une erreur 403.
12. User Story : Déconnexion
    - Critères d’acceptation
    - les cookies JWT sont supprimés ;
    - la session utilisateur est invalidée ;
    - l’utilisateur est redirigé vers la page de connexion ;
    - les routes protégées deviennent inaccessibles après déconnexion.

##    BDD

Feature: Authentification
  Afin d'accéder aux fonctionnalités sécurisées de l'application
  En tant qu'utilisateur
  Je veux pouvoir m'authentifier correctement

  Scenario 1: Connexion réussie
    Given un utilisateur possède un compte actif
    And il se trouve sur la page de connexion
    When il saisit des identifiants valides
    And il valide le formulaire
    Then il est connecté à l’application
    And il accède à son tableau de bord

  Scenario 2: Connexion échouée - mot de passe incorrect
    Given un utilisateur possède un compte actif
    And il se trouve sur la page de connexion
    When il saisit une adresse email valide
    And un mot de passe incorrect
    Then un message d’erreur s’affiche indiquant que les identifiants sont invalides
    And l’utilisateur reste sur la page de connexion

  Scenario 3: Connexion échouée - compte inexistant
    Given un utilisateur ne possède pas de compte
    And il se trouve sur la page de connexion
    When il saisit une adresse email non enregistrée
    And un mot de passe quelconque
    Then un message d’erreur indique que le compte n’existe pas
    And l’utilisateur est invité à créer un compte

  Scenario 4: Accès refusé sans authentification
    Given un utilisateur non connecté tente d’accéder à une page protégée
    When il ouvre l’URL d’une ressource nécessitant une authentification
    Then il est redirigé vers la page de connexion
    And un message l’invite à se connecter

  Scenario 5: Déconnexion réussie
    Given un utilisateur est connecté à l’application
    When il clique sur le bouton de déconnexion
    Then sa session est invalidée
    And il est redirigé vers la page de connexion
    And un message confirme qu’il a été déconnecté


Backend/
│── prisma/
│   ├── schema.prisma
│   ├── seed/
│   │   ├── seed.js
│   │   ├── data.json
│   ├── migrations/
│   │   ├── mmigration_lock.toml
│   │   ├──20260520094135_init/
│   │   │   ├──migration.sql
│── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   │   ├── env.js
│   │   ├── prisma.js
│   │   ├── jwt.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── admin.controller.js
│   │   ├── quiz.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   ├── validation.middleware.js
│   ├── repositories/
│   │   ├── auth.repository.js
│   │   ├── course.repository.js
│   │   ├── quiz.repository.js
│   │   ├── answer.repository.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── admin.routes.js
│   │   ├── quiz.routes.js
│   │   ├── index.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── grok.service.js
│   │   ├── quiz.service.js
│   │   ├── user.service.js
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── quiz.validator.js
│── tests/
│   ├── unit/
│   │   ├── auth.service.test.js
│   │   ├── quiz.service.test.js
│   ├── integration/
│   │   ├── auth.routes.test.js
│   ├── e2e/
│   │   ├── api.e2e.test.js
│   ├── setup/
│   │   ├── test.env.js
│   │   ├── jwt.mock.js
│   │   ├── prisma.mock.js
│   ├── support/
│   │   ├── config.js
│   │   ├── hooks.js
│   │   ├── world.js
│   ├── features/
│   │   ├── auth.feature
│── .env.example
│── docker-compose.yml
│── package.json

Frontend/
│── app/
│   ├──  favicon.ico
│   ├──globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── api/
│        ├── generate
│            ├── route.ts
│── componets/
│   ├── loadingPhase.tsx
│   ├── LoginPage.tsx
│   ├── QuizApp.tsx
│   ├── RegisterPage.tsx
│   ├── ResultsPhase.tsx
│   ├── UploadPhase.tsx
├── lib/
│   ├── generateQuiz.ts
│   ├── Types.ts
├── modules/
│   ├── loadingPhase.modules.css
│   ├── LoginPage.modules.css
│   ├── QuizApp.modules.css
│   ├── QuizPhase.modules.css
│   ├── RegisterPage.modules.css
│   ├── ResultsPhase.modules.css
│   ├── UploadPhase.modules.css
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   ├── window.svg
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.-lock.json
├── package.json
│── postcss.config
│── README.md
│── tsconfig.json

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
Le lien frontend
    https://node-js-cours-vuxo.vercel.app/
Le lien du Backend 
    
