'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'ragioneSociale', { type: Sequelize.STRING });
    await queryInterface.addColumn('Users', 'cap', { type: Sequelize.STRING });
    await queryInterface.addColumn('Users', 'pv', { type: Sequelize.STRING });
    await queryInterface.addColumn('Users', 'codiceFiscale', { type: Sequelize.STRING });
    await queryInterface.addColumn('Users', 'partitaIva', { type: Sequelize.STRING });
    await queryInterface.addColumn('Users', 'emailPartner', { type: Sequelize.STRING, validate: { isEmail: true } });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'ragioneSociale');
    await queryInterface.removeColumn('Users', 'cap');
    await queryInterface.removeColumn('Users', 'pv');
    await queryInterface.removeColumn('Users', 'codiceFiscale');
    await queryInterface.removeColumn('Users', 'partitaIva');
    await queryInterface.removeColumn('Users', 'emailPartner');
  }
};
