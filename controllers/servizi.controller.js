const { Servizi } = require('../models');
const AppError = require('../utils/AppError');
const Joi = require('joi');

// Schema di validazione con Joi
const serviziSchema = Joi.object({
  nomeServizio: Joi.string().required(),
});

class ServiziController {
  async create(req, res, next) {
    try {
      const validatedData = await serviziSchema.validateAsync(req.body);
      const nuovoServizio = await Servizi.create(validatedData);

      res.status(201).json({
        success: true,
        message: "Servizio inserito con successo",
        data: nuovoServizio,
      });
    } catch (error) {
      if (error.isJoi) {
        next(new AppError("Dati non validi: " + error.message, 400));
      } else {
        console.error("Errore durante l'inserimento del servizio:", error);
        next(new AppError("Errore durante l'inserimento del servizio", 500));
      }
    }
  }

  async read(req, res, next) {
    try {
      const servizi = await Servizi.findAll();
      res.status(200).json({
        success: true,
        message: "Servizi recuperati con successo",
        data: servizi,
      });
    } catch (error) {
      console.error("Errore durante il recupero dei servizi:", error);
      next(new AppError("Errore durante il recupero dei servizi", 500));
    }
  }

  async getById(req, res, next) {
    const { servizioId } = req.params;
    try {
      const servizio = await Servizi.findByPk(servizioId);
      if (!servizio) {
        return next(new AppError("Servizio non trovato", 404));
      }

      res.status(200).json({
        success: true,
        message: "Servizio recuperato con successo",
        data: servizio,
      });
    } catch (error) {
      console.error("Errore durante il recupero del servizio:", error);
      next(new AppError("Errore durante il recupero del servizio", 500));
    }
  }

  async update(req, res, next) {
    const { servizioId } = req.params;
    try {
      const validatedData = await serviziSchema.validateAsync(req.body);
      const servizio = await Servizi.findByPk(servizioId);
      if (!servizio) {
        return next(new AppError("Servizio non trovato", 404));
      }

      await servizio.update(validatedData);
      res.status(200).json({
        success: true,
        message: "Servizio aggiornato con successo",
        data: servizio,
      });
    } catch (error) {
      if (error.isJoi) {
        next(new AppError("Dati non validi: " + error.message, 400));
      } else {
        console.error("Errore durante l'aggiornamento del servizio:", error);
        next(new AppError("Errore durante l'aggiornamento del servizio", 500));
      }
    }
  }

  async delete(req, res, next) {
    const { servizioId } = req.params;
    try {
      const servizio = await Servizi.findByPk(servizioId);
      if (!servizio) {
        return next(new AppError("Servizio non trovato", 404));
      }
      await servizio.destroy();
      res.status(204).send();
    } catch (error) {
      console.error("Errore durante l'eliminazione del servizio:", error);
      next(new AppError("Errore durante l'eliminazione del servizio", 500));
    }
  }
}

module.exports = new ServiziController();
