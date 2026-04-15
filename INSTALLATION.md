# 🛠️ Guide d'installation et résolution des problèmes

## Installation standard

```bash
npm install
npm run dev
```

## ❌ Erreur 500 sur /api/auth/register ou /api/auth/login ?

C'est un problème courant avec `sqlite3` qui nécessite une compilation C++.

### Solution 1 — Recompiler sqlite3 (recommandé)

```bash
npm install
npm rebuild sqlite3
npm run dev
```

### Solution 2 — Forcer la compilation depuis les sources

```bash
npm install sqlite3 --build-from-source
npm run dev
```

### Solution 3 — Installer les outils de build (Windows)

```bash
npm install --global windows-build-tools
npm install
npm run dev
```

### Solution 4 — Utiliser Python + node-gyp

```bash
# Vérifier que Python est installé
python --version

# Puis
npm install
npm run dev
```

### Tester si SQLite fonctionne

```bash
npm run test:db
```

Si vous voyez `✅ SQLite fonctionne correctement!` → le problème vient d'ailleurs.
Si vous voyez `❌ Erreur SQLite` → suivez les solutions ci-dessus.

## Variables d'environnement

Créer un fichier `.env.local` à la racine :

```
JWT_SECRET=votre_secret_jwt_ici
```

## Vérification

Une fois démarré, ouvrir : http://localhost:3000

1. Aller sur `/register` → créer un compte
2. Se connecter sur `/login`
3. Explorer `/projects` et `/testimonials`

---

## 🔄 Mettre à jour les projets (seed)

Si tu as déjà lancé le projet une fois, la base de données existe déjà.
Pour forcer le rechargement avec les nouveaux projets, supprime la DB et relance :

**Windows :**
```bash
del portfolio.sqlite
npm run dev
```

**Mac / Linux :**
```bash
rm portfolio.sqlite
npm run dev
```
