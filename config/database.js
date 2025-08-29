const { Sequelize } = require('sequelize');
const config = require('./config.json').development;

console.log('🔍 Configurazione database:', config);

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  logging: console.log, // Debug per visualizzare le query
});

module.exports = sequelize;
