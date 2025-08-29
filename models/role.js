'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Role extends Model {
  static associate(models) {
    Role.hasMany(models.User, { foreignKey: 'roleId', as: 'users' });
  }
}

Role.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  }
}, {
  sequelize,
  modelName: 'Role',
});

module.exports = Role;
