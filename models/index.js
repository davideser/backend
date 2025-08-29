'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

// Log per verificare la configurazione del database
console.log('🔍 Database Config:', config);

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    logging: console.log, // Log delle query
  });
}

// Log per confermare che Sequelize si connette al database corretto
sequelize.authenticate()
  .then(() => console.log('✅ Connessione al database riuscita:', config.database))
  .catch((error) => console.error('❌ Errore di connessione al database:', error));

// Caricamento dei modelli
fs
  .readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
  .forEach(file => {
    const modelImport = require(path.join(__dirname, file));
    const model = modelImport.init ? modelImport : modelImport(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Gestione delle associazioni
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Sincronizzazione automatica del database
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log('✅ Database sincronizzato correttamente.');
  })
  .catch((error) => {
    console.error('❌ Errore durante la sincronizzazione del database:', error);
  });

module.exports = db;
