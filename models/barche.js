'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Barche extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Barche.init({
    nomeBarca: DataTypes.STRING,
    modelloBarca: DataTypes.STRING,
    capienzaPersone: DataTypes.INTEGER,
    coloreBarca: DataTypes.STRING,
    marinaioBarca: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Barche',
  });
  return Barche;
};