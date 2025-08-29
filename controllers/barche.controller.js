const { Barche } = require('../models');
const AppError = require('../utils/AppError');
const Joi = require('joi');

// Schema di validazione con Joi
const barcaSchema = Joi.object({
  nomeBarca: Joi.string().required(),
  modelloBarca: Joi.string().required(),
  capienzaPersone: Joi.number().integer().min(1).required(),
  coloreBarca: Joi.string().optional(),
  marinaioBarca: Joi.string().optional(),
});

class BarcheController {
  // Crea una nuova barca
  async create(req, res, next) {
    try {
      const validatedData = await barcaSchema.validateAsync(req.body);
      const nuovaBarca = await Barche.create(validatedData);

      res.status(201).json({
        success: true,
        message: "Barca inserita con successo",
        data: nuovaBarca,
      });
    } catch (error) {
      if (error.isJoi) {
        return next(new AppError("Dati non validi: " + error.message, 400));
      }
      console.error("Errore durante l'inserimento della barca:", error);
      next(new AppError("Errore durante l'inserimento della barca", 500));
    }
  }

  // Ottiene tutte le barche
  async read(req, res, next) {
    try {
      const barche = await Barche.findAll();
      res.status(200).json({
        success: true,
        message: "Barche recuperate con successo",
        data: barche,
      });
    } catch (error) {
      console.error("Errore durante il recupero delle barche:", error);
      next(new AppError("Errore durante il recupero delle barche", 500));
    }
  }

  // Recupera una singola barca per ID
  async getById(req, res, next) {
    const { barcaId } = req.params;
    try {
      const barca = await Barche.findByPk(barcaId);
      if (!barca) {
        return next(new AppError("Barca non trovata", 404));
      }

      res.status(200).json({
        success: true,
        message: "Barca recuperata con successo",
        data: barca,
      });
    } catch (error) {
      console.error("Errore durante il recupero della barca:", error);
      next(new AppError("Errore durante il recupero della barca", 500));
    }
  }

  // Aggiorna una barca esistente
  async update(req, res, next) {
    const { barcaId } = req.params;
    try {
      const validatedData = await barcaSchema.validateAsync(req.body);
      const barca = await Barche.findByPk(barcaId);
      if (!barca) {
        return next(new AppError("Barca non trovata", 404));
      }

      await barca.update(validatedData);

      res.status(200).json({
        success: true,
        message: "Barca aggiornata con successo",
        data: barca,
      });
    } catch (error) {
      if (error.isJoi) {
        return next(new AppError("Dati non validi: " + error.message, 400));
      }
      console.error("Errore durante l'aggiornamento della barca:", error);
      next(new AppError("Errore durante l'aggiornamento della barca", 500));
    }
  }

  // Elimina una barca esistente
  async delete(req, res, next) {
    const { barcaId } = req.params;
    try {
      const barca = await Barche.findByPk(barcaId);
      if (!barca) {
        return next(new AppError("Barca non trovata", 404));
      }
      await barca.destroy();
      res.status(204).send();
    } catch (error) {
      console.error("Errore durante l'eliminazione della barca:", error);
      next(new AppError("Errore durante l'eliminazione della barca", 500));
    }
  }
}

module.exports = new BarcheController();
