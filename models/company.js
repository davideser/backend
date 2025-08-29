'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Company extends Model {
  static associate(models) {
    Company.hasMany(models.User, { foreignKey: 'companyId', as: 'users' });
  }
}

Company.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  ragioneSociale: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cap: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pv: {
    type: DataTypes.STRING,
    allowNull: false
  },
  codiceFiscale: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  partitaIva: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  emailPartner: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  partnerType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  codiceUnivoco: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  indirizzo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  capZip: {
    type: DataTypes.STRING,
    allowNull: false
  },
  citta: {
    type: DataTypes.STRING,
    allowNull: false
  },
  prov: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telefonoFisso: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cellulare: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Company',
});

module.exports = Company;
