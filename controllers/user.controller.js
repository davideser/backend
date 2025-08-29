const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, RefreshToken, Role, Company } = require('../models');
const blacklist = require('../utils/blacklist');

// 📌 Funzione per generare un token JWT
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role.name },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// 📌 Login
exports.login = async (req, res) => {
  try {
    console.log('🔹 Tentativo di login:', req.body);
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username e password richiesti' });
    }

    const user = await User.findOne({
      where: { username },
      include: { model: Role, as: 'role' },
    });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Credenziali non valide' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = await RefreshToken.createToken(user);

    console.log('✅ Login riuscito!');
    res.status(200).json({ accessToken, refreshToken, user });
  } catch (error) {
    console.error('❌ Errore durante il login:', error);
    res.status(500).json({ message: 'Errore nel login', error: error.message });
  }
};

// 📌 Logout
exports.logout = async (req, res) => {
  try {
    blacklist.add(req.headers.authorization.split(' ')[1]);
    await RefreshToken.destroy({ where: { userId: req.user.id } });
    res.status(200).json({ message: 'Logout effettuato con successo' });
  } catch (error) {
    res.status(500).json({ message: 'Errore nel logout' });
  }
};

// 📌 Refresh Token
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'Refresh token richiesto' });

    const validToken = await RefreshToken.verifyToken(refreshToken);
    const user = await User.findByPk(validToken.userId);

    const newAccessToken = generateAccessToken(user);
    await validToken.destroy();
    const newRefreshToken = await RefreshToken.createToken(user);

    res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// 📌 Recupera tutti gli utenti
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'roleId', 'companyId', 'status', 'createdAt'],
      include: [
        { model: Role, as: 'role', attributes: ['id', 'name'] },
        { model: Company, as: 'company', attributes: ['name'] }
      ]
    });

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("❌ Errore nel recupero utenti:", error);
    res.status(500).json({ message: 'Errore nel recupero utenti' });
  }
};

// 📌 Crea un nuovo utente o un partner con azienda associata
exports.createUser = async (req, res) => {
  try {
    console.log("🔍 Dati ricevuti nel backend:", req.body);

    const { username, email, password, roleId, companyId } = req.body;
    if (!username || !email || !password || !roleId) {
      return res.status(400).json({ message: 'Tutti i campi obbligatori devono essere compilati.' });
    }

    let newCompanyId = companyId;

    if (Number(roleId) === 2 && !companyId) {
      const { emailPartner, ragioneSociale, codiceFiscale, partitaIva } = req.body;
      if (!ragioneSociale || !emailPartner || !codiceFiscale || !partitaIva) {
        return res.status(400).json({ message: 'Tutti i campi aziendali sono obbligatori per i partner.' });
      }

      const newCompany = await Company.create(req.body);
      newCompanyId = newCompany.id;
      console.log("✅ Compagnia creata con ID:", newCompanyId);
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      roleId,
      companyId: newCompanyId
    });

    console.log("✅ Utente creato:", newUser.toJSON());
    res.status(201).json({ user: newUser, companyId: newCompanyId });
  } catch (error) {
    console.error('❌ Errore nella creazione utente:', error);
    res.status(500).json({ message: 'Errore nella creazione utente', error: error.message });
  }
};

// 📌 Recupera utente per ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId, { include: { model: Role, as: 'role' } });
    if (!user) return res.status(404).json({ message: 'Utente non trovato' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero utente' });
  }
};

// 📌 Aggiorna utente
exports.updateUser = async (req, res) => {
  try {
    const { username, email, roleId } = req.body;
    const updated = await User.update(
      { username, email, roleId },
      { where: { id: req.params.userId } }
    );
    if (!updated[0]) return res.status(404).json({ message: 'Utente non trovato' });
    res.status(200).json({ message: 'Utente aggiornato con successo' });
  } catch (error) {
    res.status(500).json({ message: 'Errore nell\'aggiornamento utente' });
  }
};

// 📌 Elimina utente
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.destroy({ where: { id: req.params.userId } });
    if (!deleted) return res.status(404).json({ message: 'Utente non trovato' });
    res.status(200).json({ message: 'Utente eliminato con successo' });
  } catch (error) {
    res.status(500).json({ message: 'Errore nell\'eliminazione utente' });
  }
};

// 📌 Dichiarazione esplicita della funzione createPartner
exports.createPartner = async (req, res) => {
  try {
    const {
      username, email, password, roleId,
      emailPartner, ragioneSociale, cap, pv, codiceFiscale, partitaIva,
      partnerType, codiceUnivoco, indirizzo, capZip, citta, prov, telefonoFisso, cellulare
    } = req.body;

    if (!username || !email || !password || !roleId) {
      return res.status(400).json({ message: 'Tutti i campi obbligatori devono essere compilati.' });
    }

    // Creazione della compagnia
    const newCompany = await Company.create({
      name: ragioneSociale, // Usa ragioneSociale come nome azienda
      ragioneSociale,
      cap,
      pv,
      codiceFiscale,
      partitaIva,
      emailPartner,
      partnerType,
      codiceUnivoco,
      indirizzo,
      capZip,
      citta,
      prov,
      telefonoFisso,
      cellulare
    });
    
    

    // Creazione utente associato
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      roleId,
      companyId: newCompany.id
    });

    res.status(201).json({ user: newUser, company: newCompany });
  } catch (error) {
    console.error('❌ Errore nella creazione del partner:', error);
    res.status(500).json({ message: 'Errore nella creazione del partner', error: error.message });
  }
};

// Esportazione corretta
module.exports = {
  login: exports.login,
  logout: exports.logout,
  refreshToken: exports.refreshToken,
  getAllUsers: exports.getAllUsers,
  createUser: exports.createUser,
  getUserById: exports.getUserById,
  updateUser: exports.updateUser,
  deleteUser: exports.deleteUser,
  createPartner: exports.createPartner
};
