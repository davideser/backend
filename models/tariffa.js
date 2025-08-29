'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tariffa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Tariffa.init({
    nomePartner: DataTypes.STRING,
    tipoServizio: DataTypes.STRING,
    tariffa: DataTypes.FLOAT,
    nomeBarca: DataTypes.STRING,
    modelloBarca: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Tariffa',
  });
  return Tariffa;
};