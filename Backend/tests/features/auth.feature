Feature: Authentification
  Afin d'accéder aux fonctionnalités sécurisées de l'application
  En tant qu'utilisateur
  Je veux pouvoir m'authentifier correctement

  Scenario: Connexion réussie
    Given un utilisateur possède un compte actif
    And il se trouve sur la page de connexion
    When il saisit des identifiants valides
    And il valide le formulaire
    Then il est connecté à l’application
    And il accède à son tableau de bord

  Scenario: Connexion échouée - mot de passe incorrect
    Given un utilisateur possède un compte actif
    And il se trouve sur la page de connexion
    When il saisit une adresse email valide
    And un mot de passe incorrect
    Then un message d’erreur s’affiche indiquant que les identifiants sont invalides
    And l’utilisateur reste sur la page de connexion

  Scenario: Connexion échouée - compte inexistant
    Given un utilisateur ne possède pas de compte
    And il se trouve sur la page de connexion
    When il saisit une adresse email non enregistrée
    And un mot de passe quelconque
    Then un message d’erreur indique que le compte n’existe pas
    And l’utilisateur est invité à créer un compte

  Scenario: Accès refusé sans authentification
    Given un utilisateur non connecté tente d’accéder à une page protégée
    When il ouvre l’URL d’une ressource nécessitant une authentification
    Then il est redirigé vers la page de connexion
    And un message l’invite à se connecter

  Scenario: Déconnexion réussie
    Given un utilisateur est connecté à l’application
    When il clique sur le bouton de déconnexion
    Then sa session est invalidée
    And il est redirigé vers la page de connexion
    And un message confirme qu’il a été déconnecté
