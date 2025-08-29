'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Companies', 'partnerType', {
      type: Sequelize.STRING,
      allowNull: false
    });
    await queryInterface.addColumn('Companies', 'codiceUnivoco', {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    });
    await queryInterface.addColumn('Companies', 'indirizzo', {
      type: Sequelize.STRING,
      allowNull: false
    });
    await queryInterface.addColumn('Companies', 'capZip', {
      type: Sequelize.STRING,
      allowNull: false
    });
    await queryInterface.addColumn('Companies', 'citta', {
      type: Sequelize.STRING,
      allowNull: false
    });
    await queryInterface.addColumn('Companies', 'prov', {
      type: Sequelize.STRING,
      allowNull: false
    });
    await queryInterface.addColumn('Companies', 'telefonoFisso', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Companies', 'cellulare', {
      type: Sequelize.STRING,
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Companies', 'partnerType');
    await queryInterface.removeColumn('Companies', 'codiceUnivoco');
    await queryInterface.removeColumn('Companies', 'indirizzo');
    await queryInterface.removeColumn('Companies', 'capZip');
    await queryInterface.removeColumn('Companies', 'citta');
    await queryInterface.removeColumn('Companies', 'prov');
    await queryInterface.removeColumn('Companies', 'telefonoFisso');
    await queryInterface.removeColumn('Companies', 'cellulare');
  }
};

