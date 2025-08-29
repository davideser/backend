'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Event.init({
    relazioneCommerciale: DataTypes.STRING,
    codiceRif: DataTypes.STRING,
    nomeCliente: DataTypes.STRING,
    cognomeCliente: DataTypes.STRING,
    personeTotali: DataTypes.INTEGER,
    disposizione: DataTypes.STRING,
    inizioPercorso: DataTypes.STRING,
    finePercorso: DataTypes.STRING,
    dataInizio: DataTypes.DATE,
    dataFine: DataTypes.DATE,
    marinaio: DataTypes.STRING,
    prezzo: DataTypes.FLOAT,
    tipoPagamento: DataTypes.STRING,
    noteComandante: DataTypes.TEXT,
    noteInterne: DataTypes.TEXT,
    commissione: DataTypes.FLOAT,
    iva: DataTypes.FLOAT,
    coloreBarca: DataTypes.STRING,
    numeroVolo: DataTypes.STRING,
    coloreEvento: DataTypes.STRING,
    idBarca: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};