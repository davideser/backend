const { Tariffa } = require('../models');
const AppError = require('../utils/AppError');
const Joi = require('joi');

// Schema di validazione con Joi
const tariffaSchema = Joi.object({
  nomeTariffa: Joi.string().required(),
  prezzo: Joi.number().required(),
  descrizione: Joi.string().optional(),
});

class TariffaController {
  async create(req, res, next) {
    try {
      const validatedData = await tariffaSchema.validateAsync(req.body);
      const nuovaTariffa = await Tariffa.create(validatedData);

      res.status(201).json({
        success: true,
        message: "Tariffa inserita con successo",
        data: nuovaTariffa,
      });
    } catch (error) {
      if (error.isJoi) {
        next(new AppError("Dati non validi: " + error.message, 400));
      } else {
        console.error("Errore durante l'inserimento della tariffa:", error);
        next(new AppError("Errore durante l'inserimento della tariffa", 500));
      }
    }
  }

  async read(req, res, next) {
    try {
      const tariffe = await Tariffa.findAll();
      res.status(200).json({
        success: true,
        message: "Tariffe recuperate con successo",
        data: tariffe,
      });
    } catch (error) {
      console.error("Errore durante il recupero delle tariffe:", error);
      next(new AppError("Errore durante il recupero delle tariffe", 500));
    }
  }

  async getById(req, res, next) {
    const { tariffaId } = req.params;
    try {
      const tariffa = await Tariffa.findByPk(tariffaId);
      if (!tariffa) {
        return next(new AppError("Tariffa non trovata", 404));
      }

      res.status(200).json({
        success: true,
        message: "Tariffa recuperata con successo",
        data: tariffa,
      });
    } catch (error) {
      console.error("Errore durante il recupero della tariffa:", error);
      next(new AppError("Errore durante il recupero della tariffa", 500));
    }
  }

  async update(req, res, next) {
    const { tariffaId } = req.params;
    try {
      const validatedData = await tariffaSchema.validateAsync(req.body);
      const tariffa = await Tariffa.findByPk(tariffaId);
      if (!tariffa) {
        return next(new AppError("Tariffa non trovata", 404));
      }

      await tariffa.update(validatedData);
      res.status(200).json({
        success: true,
        message: "Tariffa aggiornata con successo",
        data: tariffa,
      });
    } catch (error) {
      if (error.isJoi) {
        next(new AppError("Dati non validi: " + error.message, 400));
      } else {
        console.error("Errore durante l'aggiornamento della tariffa:", error);
        next(new AppError("Errore durante l'aggiornamento della tariffa", 500));
      }
    }
  }

  async delete(req, res, next) {
    const { tariffaId } = req.params;
    try {
      const tariffa = await Tariffa.findByPk(tariffaId);
      if (!tariffa) {
        return next(new AppError("Tariffa non trovata", 404));
      }

      await tariffa.destroy();
      res.status(204).json({
        success: true,
        message: "Tariffa eliminata con successo",
      });
    } catch (error) {
      console.error("Errore durante l'eliminazione della tariffa:", error);
      next(new AppError("Errore durante l'eliminazione della tariffa", 500));
    }
  }
}

module.exports = new TariffaController();
