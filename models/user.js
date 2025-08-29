'use strict';
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/database');

class User extends Model {
  static associate(models) {
    User.belongsTo(models.Role, { foreignKey: 'roleId', as: 'role' });
    User.belongsTo(models.Company, { foreignKey: 'companyId', as: 'company' });
  }
}

User.init({
  username: { type: DataTypes.STRING, allowNull: false },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      if (!value) return;
      // Se la password sembra già hashata (bcrypt hash = 60 caratteri, inizia con $2)
      if (typeof value === 'string' && value.length === 60 && value.startsWith('$2')) {
        this.setDataValue('password', value);
      } else {
        this.setDataValue('password', bcrypt.hashSync(value, 10));
      }
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Roles',
      key: 'id',
    },
  },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Companies',
      key: 'id',
    },
  },
}, {
  sequelize,
  modelName: 'User',
});

module.exports = User;

