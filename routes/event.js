const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');


const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

// CRUD completo per eventi
router.post('/', verifyToken, checkRole(['Admin']), eventController.create); // Crea evento (Admin)
router.get('/', verifyToken, eventController.getAll); // Lista eventi (autenticati)
router.get('/:eventId', verifyToken, eventController.getById); // Dettaglio evento (autenticati)
router.put('/:eventId', verifyToken, checkRole(['Admin']), eventController.update); // Modifica evento (Admin)
router.delete('/:eventId', verifyToken, checkRole(['Admin']), eventController.delete); // Elimina evento (Admin)

module.exports = router;
