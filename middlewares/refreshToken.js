// src/middleware/refreshToken.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const blacklist = require('../utils/blacklist');

const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  // 🔍 Verifica se il token di refresh è valido
  if (!refreshToken) {
    return res.status(401).json({ message: 'Token di refresh mancante' });
  }

  // ⚠️ Controlla se è stato invalidato
  if (blacklist.includes(refreshToken)) {
    return res.status(401).json({ message: 'Token di refresh invalidato, rieffettua il login' });
  }

  // 🔐 Verifica il refresh token
  jwt.verify(refreshToken, process.env.REFRESH_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token di refresh non valido' });
    }

    // ✅ Genera un nuovo access token
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    const newAccessToken = jwt.sign(
      { id: user.id, username: user.username, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken: newAccessToken });
  });
};

module.exports = refreshAccessToken;
