const express = require('express');
const router = express.Router();
const TariffaController = require('../controllers/tariffa.controller');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');


router.post('/', verifyToken, checkRole(['Admin']), TariffaController.create);            // Crea una nuova tariffa
router.get('/', verifyToken, checkRole(['Admin']), TariffaController.read);               // Ottiene tutte le tariffe
router.get('/:tariffaId', verifyToken, checkRole(['Admin']), TariffaController.getById);  // Recupera una tariffa per ID
router.put('/:tariffaId', verifyToken, checkRole(['Admin']), TariffaController.update);   // Aggiorna una tariffa esistente
router.delete('/:tariffaId', verifyToken, checkRole(['Admin']), TariffaController.delete); // Elimina una tariffa esistente

module.exports = router;
