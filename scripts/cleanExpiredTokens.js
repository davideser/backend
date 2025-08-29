const RefreshToken = require('../models/refreshToken');
const sequelize = require('../config/database');

async function deleteExpiredTokens() {
  try {
    const now = new Date();
    await RefreshToken.destroy({
      where: {
        expiresAt: { [sequelize.Sequelize.Op.lt]: now }
      }
    });
    console.log('Token scaduti eliminati.');
  } catch (error) {
    console.error('Errore durante la pulizia dei token:', error);
  }
}

// Esegui ogni 24 ore
setInterval(deleteExpiredTokens, 24 * 60 * 60 * 1000);

module.exports = deleteExpiredTokens;
