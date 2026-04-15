const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

async function test() {
  console.log('Test connexion SQLite...');
  try {
    const sq = new Sequelize({
      dialect: 'sqlite',
      storage: path.join(__dirname, '..', 'test.sqlite'),
      logging: false,
    });
    await sq.authenticate();
    console.log('✅ SQLite fonctionne correctement!');
    const p = path.join(__dirname, '..', 'test.sqlite');
    if (fs.existsSync(p)) fs.unlinkSync(p);
  } catch (err) {
    console.error('❌ Erreur SQLite:', err.message);
    console.log('Solution: npm rebuild sqlite3 OU npm install sqlite3 --build-from-source');
  }
}
test();
