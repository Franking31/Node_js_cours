const { Given, When, Then } = require('@cucumber/cucumber');
const request = require('supertest');
const config = require('../support/config');
const app = require('../../src/server'); // adapte selon ton projet

let response;

Given('un utilisateur possède un compte actif', function () {
  // Setup éventuel : création d’un utilisateur test en BDD
  this.user = {
    email: "test@test.com",
    password: "123456"
  };
});

Given('il se trouve sur la page de connexion', function () {
  // Rien à faire pour une API, mais nécessaire pour le scénario
});

When('il saisit des identifiants valides', async function () {
  response = await request(app)
    .post('/auth/login')
    .send(this.user);
});

When('il valide le formulaire', function () {
  // Déjà fait dans la requête précédente
});

Then('il est connecté à l’application', function () {
  if (response.status !== 200) {
    throw new Error('Connexion échouée');
  }
});

Then('il accède à son tableau de bord', function () {
  if (!response.body.token) {
    throw new Error('Token manquant, connexion non valide');
  }
});

When('il saisit une adresse email valide', function () {
  this.user = { email: "test@test.com" };
});

When('un mot de passe incorrect', async function () {
  response = await request(app)
    .post('/auth/login')
    .send({ email: this.user.email, password: "mauvais_mdp" });
});

Then('un message d’erreur s’affiche indiquant que les identifiants sont invalides', function () {
  if (response.status !== 401) {
    throw new Error('Erreur attendue non reçue');
  }
});

Given('un utilisateur ne possède pas de compte', function () {
  this.user = { email: "inconnu@test.com", password: "123456" };
});

When('il saisit une adresse email non enregistrée', function () {
  // déjà dans this.user
});

When('un mot de passe quelconque', async function () {
  response = await request(app)
    .post('/auth/login')
    .send(this.user);
});

Then('un message d’erreur indique que le compte n’existe pas', function () {
  if (response.status !== 404) {
    throw new Error('Le message attendu n’a pas été reçu');
  }
});

Given('un utilisateur non connecté tente d’accéder à une page protégée', function () {
  // Pas de token
});

When('il ouvre l’URL d’une ressource nécessitant une authentification', async function () {
  response = await request(app)
    .get('/dashboard')
    .set('Authorization', '');
});

Then('il est redirigé vers la page de connexion', function () {
  if (response.status !== 401) {
    throw new Error('Accès non protégé');
  }
});

Given('un utilisateur est connecté à l’application', async function () {
  const login = await request(app)
    .post('/auth/login')
    .send({ email: "test@test.com", password: "123456" });

  this.token = login.body.token;
});

When('il clique sur le bouton de déconnexion', async function () {
  response = await request(app)
    .post('/auth/logout')
    .set('Authorization', `Bearer ${this.token}`);
});

Then('sa session est invalidée', function () {
  if (response.status !== 200) {
    throw new Error('Déconnexion échouée');
  }
});
