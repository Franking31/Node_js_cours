# Seed de démarrage Prisma — Plateforme Quiz IA

## Structure proposée

```text
prisma/
├── seed/
│   ├── data.json
│   └── seed.js
```

---

# 1. package.json

Ajouter :

```json
{
  "prisma": {
    "seed": "node prisma/seed/seed.js"
  }
}
```

---

# 2. Variables d’environnement

## .env

```env
ADMIN_NAME=Super Admin
ADMIN_EMAIL=admin@quizai.com
ADMIN_PASSWORD=Admin123456
```

---

# 3. data.json

## prisma/seed/data.json

```json
{
  "students": [
    {
      "name": "John Student",
      "email": "john@student.com",
      "password": "Student123",
      "courses": [
        {
          "title": "Introduction JavaScript",
          "subject": "JavaScript",
          "level": "Licence 3",
          "content": "JavaScript est un langage de programmation utilise pour le developpement web."
        },
        {
          "title": "Base de donnees SQL",
          "subject": "Database",
          "level": "Licence 3",
          "content": "SQL permet de manipuler les bases de donnees relationnelles."
        }
      ]
    },
    {
      "name": "Alice Student",
      "email": "alice@student.com",
      "password": "Student123",
      "courses": [
        {
          "title": "Architecture Logicielle",
          "subject": "Software Engineering",
          "level": "Master 1",
          "content": "Une architecture logicielle organise les composants d'une application."
        },
        {
          "title": "Reseaux Informatiques",
          "subject": "Networking",
          "level": "Licence 3",
          "content": "Les reseaux permettent la communication entre machines."
        }
      ]
    }
  ]
}
```

---

# 4. seed.js

## prisma/seed/seed.js

```js

```

---

# 5. Lancer le seed

```bash
npx prisma db seed
```

---

# 6. Résultat

Le seed va créer :

* 1 administrateur
* 2 étudiants
* plusieurs cours
* plusieurs quiz
* des questions
* des réponses
* des scores

Ce qui te donnera directement une base de test réaliste pour le frontend et les APIs.
