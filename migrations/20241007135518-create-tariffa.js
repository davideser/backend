'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tariffas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nomePartner: {
        type: Sequelize.STRING
      },
      tipoServizio: {
        type: Sequelize.STRING
      },
      tariffa: {
        type: Sequelize.FLOAT
      },
      nomeBarca: {
        type: Sequelize.STRING
      },
      modelloBarca: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Tariffas');
  }
};