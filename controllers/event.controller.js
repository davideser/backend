const { Event } = require('../models');
const AppError = require('../utils/AppError');
const Joi = require('joi');

// Schema di validazione con Joi
const eventSchema = Joi.object({
  nome: Joi.string().required(),
  data: Joi.date().required(),
  descrizione: Joi.string().optional(),
});

class EventController {
  async create(req, res, next) {
    try {
      const validatedData = await eventSchema.validateAsync(req.body);
      const newEvent = await Event.create(validatedData);
      res.status(201).json({
        success: true,
        message: "Evento creato con successo",
        data: newEvent,
      });
    } catch (error) {
      if (error.isJoi) {
        next(new AppError("Dati non validi: " + error.message, 400));
      } else {
        console.error("Errore durante la creazione dell'evento:", error);
        next(new AppError("Errore durante la creazione dell'evento", 500));
      }
    }
  }

  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;
      const events = await Event.findAndCountAll({
        limit: parseInt(limit),
        offset: parseInt(offset),
      });
      res.status(200).json({
        success: true,
        message: "Eventi recuperati con successo",
        data: events.rows,
        total: events.count,
        page: parseInt(page),
        totalPages: Math.ceil(events.count / limit),
      });
    } catch (error) {
      console.error("Errore durante il recupero degli eventi:", error);
      next(new AppError("Errore durante il recupero degli eventi", 500));
    }
  }

  async getById(req, res, next) {
    const { eventId } = req.params;
    try {
      const event = await Event.findByPk(eventId);
      if (!event) {
        return next(new AppError("Evento non trovato", 404));
      }

      res.status(200).json({
        success: true,
        message: "Evento recuperato con successo",
        data: event,
      });
    } catch (error) {
      console.error("Errore durante il recupero dell'evento:", error);
      next(new AppError("Errore durante il recupero dell'evento", 500));
    }
  }

  async update(req, res, next) {
    const { eventId } = req.params;
    try {
      const validatedData = await eventSchema.validateAsync(req.body);
      const event = await Event.findByPk(eventId);
      if (!event) {
        return next(new AppError("Evento non trovato", 404));
      }

      await event.update(validatedData);
      res.status(200).json({
        success: true,
        message: "Evento aggiornato con successo",
        data: event,
      });
    } catch (error) {
      if (error.isJoi) {
        next(new AppError("Dati non validi: " + error.message, 400));
      } else {
        console.error("Errore durante l'aggiornamento dell'evento:", error);
        next(new AppError("Errore durante l'aggiornamento dell'evento", 500));
      }
    }
  }

  async delete(req, res, next) {
    const { eventId } = req.params;
    try {
      const event = await Event.findByPk(eventId);
      if (!event) {
        return next(new AppError("Evento non trovato", 404));
      }

      await event.destroy();
      res.status(204).json({
        success: true,
        message: "Evento eliminato con successo",
      });
    } catch (error) {
      console.error("Errore durante l'eliminazione dell'evento:", error);
      next(new AppError("Errore durante l'eliminazione dell'evento", 500));
    }
  }
}

module.exports = new EventController();
