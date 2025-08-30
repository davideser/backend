const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');
const userController = require('../controllers/user.controller');

// Crea un partner (Admin)
router.post('/', verifyToken, checkRole(['Admin']), userController.createPartner);

module.exports = router;
