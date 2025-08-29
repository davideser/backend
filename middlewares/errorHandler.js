const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  // Logga sempre l'errore
  logger.error(err.message);

  // Determina lo status code
  const statusCode = err.status || 500;
  const message = err.isOperational ? err.message : 'Errore interno del server';

  // Restituisci una risposta uniforme
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = errorHandler;
