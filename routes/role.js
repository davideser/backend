const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role.controller');
const { verifyToken } = require('../middlewares/authMiddleware');

// Aggiungi il middleware di autenticazione
router.get('/', verifyToken, roleController.getAll);

module.exports = router;
