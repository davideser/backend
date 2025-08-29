'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Roles', [
      {
        name: 'Amministratore',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Marinaio',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Partner',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Roles', null, {});
  }
};
