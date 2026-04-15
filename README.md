# 🚀 Portfolio — Mazigh Aissat

Portfolio personnel développé avec **Next.js 14**, **Redux Toolkit**, **Sequelize** et **SQLite**.

---

## 📋 Description

Application web full-stack servant de portfolio professionnel. Elle inclut un système d'authentification complet, une gestion de projets et de témoignages, le tout avec une protection des routes et une communication backend via Next.js API Routes.

---

## 🛠️ Technologies utilisées

| Catégorie | Technologies |
|-----------|-------------|
| **Frontend** | Next.js 14, React 18, CSS personnalisé |
| **State Management** | Redux Toolkit, React-Redux |
| **HTTP Client** | Axios |
| **Backend** | Next.js API Routes |
| **Base de données** | Sequelize ORM + SQLite |
| **Authentification** | JWT (jsonwebtoken) + bcryptjs |
| **Sessions** | js-cookie |

---

## 📁 Structure du projet

```
portfolio/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/route.js       ← POST /api/auth/login
│   │   │   │   └── register/route.js    ← POST /api/auth/register
│   │   │   ├── projects/
│   │   │   │   ├── route.js             ← GET /api/projects
│   │   │   │   └── [id]/route.js        ← GET /api/projects/:id
│   │   │   └── testimonials/
│   │   │       ├── route.js             ← GET, POST /api/testimonials
│   │   │       └── [id]/route.js        ← GET, PUT, DELETE /api/testimonials/:id
│   │   ├── login/page.js                ← Page publique
│   │   ├── register/page.js             ← Page publique
│   │   ├── projects/
│   │   │   ├── page.js                  ← Liste projets (protégée)
│   │   │   └── [id]/page.js             ← Détail projet (protégée)
│   │   ├── testimonials/
│   │   │   ├── page.js                  ← Liste témoignages (protégée)
│   │   │   └── new/page.js              ← Formulaire create/edit (protégée)
│   │   ├── globals.css
│   │   ├── layout.js
│   │   └── page.js                      ← Accueil (publique)
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ReduxProvider.jsx
│   │   └── withAuth.jsx                 ← HOC de protection des routes
│   ├── lib/
│   │   ├── db.js                        ← Sequelize + modèles + seed
│   │   └── auth.js                      ← JWT helpers
│   └── store/
│       ├── index.js                     ← Redux store
│       └── slices/
│           ├── authSlice.js
│           ├── projectsSlice.js
│           └── testimonialsSlice.js
├── package.json
├── next.config.js
└── jsconfig.json
```

---

## ⚙️ Installation et démarrage

```bash
# 1. Cloner le repo
git clone https://github.com/mazighaissat/portfolio.git
cd portfolio

# 2. Installer les dépendances
npm install

# 3. Lancer en développement
npm run dev

# 4. Ouvrir dans le navigateur
# http://localhost:3000
```

> La base de données SQLite (`portfolio.sqlite`) est créée automatiquement au premier démarrage avec des données de démonstration.

---

## 🔐 Fonctionnalités

### Authentification
- ✅ Inscription avec validation (nom, email, mot de passe)
- ✅ Connexion avec JWT
- ✅ Déconnexion
- ✅ Protection de toutes les routes (sauf `/login` et `/register`)
- ✅ Token stocké en cookie (7 jours)

### Pages publiques
- `GET /` — Page d'accueil avec photo, présentation et compétences
- `GET /login` — Formulaire de connexion
- `GET /register` — Formulaire d'inscription

### Pages protégées (connecté requis)
- `GET /projects` — Liste des projets
- `GET /projects/:id` — Détail d'un projet (technologies, description, liens)
- `GET /testimonials` — Liste des témoignages
- `GET /testimonials/new` — Créer/modifier un témoignage

### API Backend (Next.js API Routes)
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/auth/register` | Inscription |
| POST | `/api/auth/login` | Connexion |
| GET | `/api/projects` | Liste des projets |
| GET | `/api/projects/:id` | Détail d'un projet |
| GET | `/api/testimonials` | Liste des témoignages |
| POST | `/api/testimonials` | Créer un témoignage |
| GET | `/api/testimonials/:id` | Détail d'un témoignage |
| PUT | `/api/testimonials/:id` | Modifier un témoignage |
| DELETE | `/api/testimonials/:id` | Supprimer un témoignage |

### Validation des formulaires
- ✅ Validation côté client (messages en rouge)
- ✅ Validation côté serveur (API)
- ✅ Messages d'erreur clairs pour chaque champ

### Redux
- ✅ `authSlice` — état utilisateur, token, login/register
- ✅ `projectsSlice` — liste et détail des projets
- ✅ `testimonialsSlice` — CRUD des témoignages

---

## 📸 Captures d'écran

*(À ajouter lors de la soumission)*

---

## 👨‍💻 Auteur

**Mazigh Aissat**  
GitHub: [github.com/mazighaissat](https://github.com/mazighaissat)  
LinkedIn: [linkedin.com/in/mazighaissat](https://linkedin.com/in/mazighaissat)

---

## 📅 Cours

Projet réalisé dans le cadre du cours de développement web avec Dr. Bakary Diarra.
