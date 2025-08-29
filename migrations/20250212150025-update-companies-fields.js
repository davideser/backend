'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Companies', 'ragioneSociale', {
      type: Sequelize.STRING,
      allowNull: false
    });
    await queryInterface.addColumn('Companies', 'cap', {
      type: Sequelize.STRING,
      allowNull: false
    });
    await queryInterface.addColumn('Companies', 'pv', {
      type: Sequelize.STRING,
      allowNull: false
    });
    await queryInterface.addColumn('Companies', 'codiceFiscale', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    });
    await queryInterface.addColumn('Companies', 'partitaIva', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    });
    await queryInterface.addColumn('Companies', 'emailPartner', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Companies', 'ragioneSociale');
    await queryInterface.removeColumn('Companies', 'cap');
    await queryInterface.removeColumn('Companies', 'pv');
    await queryInterface.removeColumn('Companies', 'codiceFiscale');
    await queryInterface.removeColumn('Companies', 'partitaIva');
    await queryInterface.removeColumn('Companies', 'emailPartner');
  }
};

