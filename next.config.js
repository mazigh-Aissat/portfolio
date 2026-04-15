/** @type {import('next').NextConfig} */
const nextConfig = {
  // Externaliser sequelize et sqlite3 pour qu'ils tournent côté serveur Node.js natif
  // et ne soient PAS bundlés par webpack (évite les erreurs de compilation des modules C++)
  experimental: {
    serverComponentsExternalPackages: ['sequelize', 'sqlite3', 'tedious', 'pg', 'pg-hstore'],
  },
};

module.exports = nextConfig;
