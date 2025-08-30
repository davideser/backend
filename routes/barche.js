const express = require('express');
const router = express.Router();
const barcheController = require('../controllers/barche.controller');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, checkRole(['Admin']), barcheController.create);             // Crea una nuova barca
router.get('/', verifyToken, checkRole(['Admin']), barcheController.read);                // Ottiene tutte le barche
router.get('/:barcaId', verifyToken, checkRole(['Admin']), barcheController.getById);     // Recupera una barca per ID
router.put('/:barcaId', verifyToken, checkRole(['Admin']), barcheController.update);      // Aggiorna una barca esistente
router.delete('/:barcaId', verifyToken, checkRole(['Admin']), barcheController.delete);   // Elimina una barca esistente

module.exports = router;
