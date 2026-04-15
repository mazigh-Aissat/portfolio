import { Sequelize, DataTypes } from 'sequelize';
import path from 'path';

// Singleton pour Next.js Hot Reload
const globalForDb = globalThis;

if (!globalForDb._sequelize) {
  globalForDb._sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(process.cwd(), 'portfolio.sqlite'),
    logging: false,
  });
}

const sequelize = globalForDb._sequelize;

// ─── Models ───────────────────────────────────────────────
export const User = sequelize.define('User', {
  id:       { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name:     { type: DataTypes.STRING,  allowNull: false },
  email:    { type: DataTypes.STRING,  allowNull: false, unique: true },
  password: { type: DataTypes.STRING,  allowNull: false },
}, { timestamps: true });

export const Project = sequelize.define('Project', {
  id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title:        { type: DataTypes.STRING,  allowNull: false },
  description:  { type: DataTypes.TEXT,    allowNull: false },
  technologies: { type: DataTypes.STRING,  allowNull: false },
  github:       { type: DataTypes.STRING,  allowNull: true },
  demo:         { type: DataTypes.STRING,  allowNull: true },
  image:        { type: DataTypes.STRING,  allowNull: true },
}, { timestamps: true });

export const Testimonial = sequelize.define('Testimonial', {
  id:      { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  author:  { type: DataTypes.STRING,  allowNull: false },
  message: { type: DataTypes.TEXT,    allowNull: false },
  rating:  { type: DataTypes.INTEGER, allowNull: false, defaultValue: 5 },
  userId:  { type: DataTypes.INTEGER, allowNull: true },
}, { timestamps: true });

// ─── Seed ─────────────────────────────────────────────────
async function seedProjects() {
  const count = await Project.count();
  if (count === 0) {
    await Project.bulkCreate([
      {
        title: 'E-Commerce Platform',
        description: "Application e-commerce full-stack avec gestion des produits, panier d'achat et paiement sécurisé via Stripe. Comprend un tableau de bord administrateur et un suivi des stocks en temps réel.",
        technologies: JSON.stringify(['React', 'Node.js', 'Express', 'MongoDB', 'Stripe', 'Tailwind CSS']),
        github: 'https://github.com/mazighaissat/ecommerce',
        demo: 'https://ecommerce-demo.vercel.app',
      },
      {
        title: 'Task Management App',
        description: "Outil de gestion de projet collaboratif avec tableaux Kanban drag-and-drop, mises à jour en temps réel via WebSockets, authentification des utilisateurs et fonctionnalités de collaboration en équipe.",
        technologies: JSON.stringify(['Next.js', 'TypeScript', 'PostgreSQL', 'Socket.io', 'Redux Toolkit', 'Prisma']),
        github: 'https://github.com/mazighaissat/taskmanager',
        demo: 'https://taskmanager-demo.vercel.app',
      },
      {
        title: 'Tournoi de Golf — La Cité',
        description: "Application web de gestion de tournoi de golf développée pour le collège La Cité. Permet de gérer les participants, les scores et le classement en temps réel. Interface intuitive avec affichage dynamique des résultats.",
        technologies: JSON.stringify(['HTML', 'CSS', 'JavaScript']),
        github: 'https://github.com/mazigh-Aissat/Tournoi-de-golf-lacite',
        demo: null,
      },
    ]);
  }
}

let initialized = false;

export async function initDb() {
  if (initialized) return;
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
  await seedProjects();
  initialized = true;
}

export default sequelize;
