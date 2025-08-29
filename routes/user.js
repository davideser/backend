const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller'); // Controlla il percorso!
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

console.log("🛠️ userController:", userController);

// Rotte protette per gli utenti
router.get('/', verifyToken, checkRole(['Admin', 'Marinaio']), userController.getAllUsers);
router.post('/', verifyToken, checkRole(['Admin']), userController.createUser);
router.get('/:userId', verifyToken, userController.getUserById);
router.put('/:userId', verifyToken, userController.updateUser);
router.delete('/:userId', verifyToken, checkRole(['Admin']), userController.deleteUser);

// Rotta per il login
router.post('/login', userController.login);

// Rotta per il logout
router.post('/logout', verifyToken, userController.logout);

// Rotta per il refresh token
router.post('/refresh', userController.refreshToken);

// Rotta per creare partner
router.post('/partners', verifyToken, checkRole(['Admin']), userController.createPartner);

module.exports = router;
