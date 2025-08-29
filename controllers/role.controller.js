const { Role } = require('../models');
const AppError = require('../utils/AppError');

class RoleController {
  async getAll(req, res, next) {
    try {
      console.log('Tentativo di recupero dei ruoli...'); // Debug
      const roles = await Role.findAll();
      console.log('Ruoli recuperati con successo:', roles); // Debug
      res.status(200).json({
        success: true,
        message: "Ruoli recuperati con successo",
        data: roles,
      });
    } catch (error) {
      console.error("Errore nel recupero dei ruoli:", error);
      next(new AppError("Errore nel recupero dei ruoli", 500));
    }
  }
}

module.exports = new RoleController();
