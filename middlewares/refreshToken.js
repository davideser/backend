// src/middleware/refreshToken.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const blacklist = require('../utils/blacklist'); // Attenzione: array in memoria, non persistente!

/**
 * Middleware per il refresh del token di accesso.
 * Usa REFRESH_TOKEN_SECRET come variabile d'ambiente.
 */
const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Token di refresh mancante' });
  }

  // Controlla se il token è stato invalidato
  if (blacklist.includes(refreshToken)) {
    return res.status(401).json({ message: 'Token di refresh invalidato, rieffettua il login' });
  }

  // Verifica il refresh token
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token di refresh non valido' });
    }

    try {
      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res.status(404).json({ message: 'Utente non trovato' });
      }

      const newAccessToken = jwt.sign(
        { id: user.id, username: user.username, role: decoded.role },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );

      return res.json({ accessToken: newAccessToken });
    } catch (error) {
      return res.status(500).json({ message: 'Errore interno durante il refresh', error: error.message });
    }
  });
};

module.exports = refreshAccessToken;
