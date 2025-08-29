'use strict';
const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');
const blacklist = require('../utils/blacklist'); // Lista per token invalidati
const AppError = require('../utils/AppError');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token mancante o formato non valido' });
  }
  const token = authHeader.split(' ')[1];

  if (blacklist.includes(token)) {
    return res.status(401).json({ message: 'Token invalidato, effettua nuovamente il login' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token non valido' });
  }
};

const checkRole = (requiredRoles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findByPk(req.user.id, {
        include: { model: Role, as: 'role', attributes: ['id', 'name'] },
      });
      if (!user) {
        return next(new AppError('Utente non trovato', 404));
      }
      if (!requiredRoles.includes(user.role.name)) {
        return next(new AppError('Accesso negato', 403));
      }
      req.user.role = user.role.name;
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { verifyToken, checkRole };


