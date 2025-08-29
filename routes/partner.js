// api_backend_management.js

const express = require('express');
const router = express.Router();
const { Company, User, Role } = require('../models');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

// Tutte le rotte partner sono protette: solo Admin
router.use(verifyToken, checkRole(['Admin']));

// 📦 API: Ottieni tutte le aziende
router.get('/companies', async (req, res) => {
  try {
    const companies = await Company.findAll();
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ error: 'Errore nel recupero delle aziende' });
  }
});

// ✏️ API: Modifica azienda
router.put('/companies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const [updated] = await Company.update(updateData, { where: { id } });
    if (updated) {
      res.status(200).json({ message: 'Azienda aggiornata con successo' });
    } else {
      res.status(404).json({ message: 'Azienda non trovata' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Errore nella modifica dell\'azienda' });
  }
});

// 🗑️ API: Elimina azienda
router.delete('/companies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Company.destroy({ where: { id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Azienda non trovata' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Errore nell\'eliminazione dell\'azienda' });
  }
});

// 📦 API: Ottieni tutti gli utenti con i dettagli delle aziende e dei ruoli
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        { model: Company, as: 'company', attributes: ['name', 'emailPartner'] },
        { model: Role, as: 'role', attributes: ['name'] },
      ],
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Errore nel recupero utenti' });
  }
});

// ✏️ API: Modifica utente
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const [updated] = await User.update(updateData, { where: { id } });
    if (updated) {
      res.status(200).json({ message: 'Utente aggiornato con successo' });
    } else {
      res.status(404).json({ message: 'Utente non trovato' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Errore nella modifica dell\'utente' });
  }
});

// 🗑️ API: Elimina utente
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.destroy({ where: { id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Utente non trovato' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Errore nell\'eliminazione dell\'utente' });
  }
});

module.exports = router;
