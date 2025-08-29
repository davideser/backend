class AppError extends Error {
    constructor(message, status) {
      super(message);
      this.status = status;
      this.isOperational = true; // Indica che è un errore gestibile
    }
  }
  
  module.exports = AppError;
  