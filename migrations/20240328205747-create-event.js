'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      relazioneCommerciale: {
        type: Sequelize.STRING
      },
      codiceRif: {
        type: Sequelize.STRING
      },
      nomeCliente: {
        type: Sequelize.STRING
      },
      cognomeCliente: {
        type: Sequelize.STRING
      },
      personeTotali: {
        type: Sequelize.INTEGER
      },
      disposizione: {
        type: Sequelize.STRING
      },
      inizioPercorso: {
        type: Sequelize.STRING
      },
      finePercorso: {
        type: Sequelize.STRING
      },
      dataInizio: {
        type: Sequelize.DATE
      },
      dataFine: {
        type: Sequelize.DATE
      },
      marinaio: {
        type: Sequelize.STRING
      },
      prezzo: {
        type: Sequelize.FLOAT
      },
      tipoPagamento: {
        type: Sequelize.STRING
      },
      noteComandante: {
        type: Sequelize.TEXT
      },
      noteInterne: {
        type: Sequelize.TEXT
      },
      commissione: {
        type: Sequelize.FLOAT
      },
      iva: {
        type: Sequelize.FLOAT
      },
      coloreBarca: {
        type: Sequelize.STRING
      },
      numeroVolo: {
        type: Sequelize.STRING
      },
      coloreEvento: {
        type: Sequelize.STRING
      },
      idBarca: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Events');
  }
};