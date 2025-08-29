const express = require('express');
const router = express.Router();
const serviziController = require('../controllers/servizi.controller');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

// Protezione delle rotte: solo gli utenti con ruolo admin possono accedere
router.post('/', verifyToken, checkRole(['Admin']), serviziController.create);
router.get('/', verifyToken, checkRole(['Admin']), serviziController.read);
router.get('/:servizioId', verifyToken, checkRole(['Admin']), serviziController.getById);
router.put('/:servizioId', verifyToken, checkRole(['Admin']), serviziController.update);
router.delete('/:servizioId', verifyToken, checkRole(['Admin']), serviziController.delete);

module.exports = router;

