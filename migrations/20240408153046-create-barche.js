'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Barches', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nomeBarca: {
        type: Sequelize.STRING
      },
      modelloBarca: {
        type: Sequelize.STRING
      },
      capienzaPersone: {
        type: Sequelize.INTEGER
      },
      coloreBarca: {
        type: Sequelize.STRING
      },
      marinaioBarca: {
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
    await queryInterface.dropTable('Barches');
  }
};