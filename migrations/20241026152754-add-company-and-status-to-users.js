'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Aggiungi le colonne `company` e `status` alla tabella `Users`
    await queryInterface.addColumn('Users', 'company', {
      type: Sequelize.STRING,
      defaultValue: 'N/A',
    });

    await queryInterface.addColumn('Users', 'status', {
      type: Sequelize.STRING,
      defaultValue: 'Active',
    });
  },

  async down (queryInterface, Sequelize) {
    // Rimuovi le colonne `company` e `status` dalla tabella `Users`
    await queryInterface.removeColumn('Users', 'company');
    await queryInterface.removeColumn('Users', 'status');
  }
};
