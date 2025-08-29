const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');

// Gestione della richiesta POST per creare un nuovo evento
router.post('/', eventController.create);

// Altre route per ottenere, aggiornare ed eliminare gli eventi (se necessario)

module.exports = router;
