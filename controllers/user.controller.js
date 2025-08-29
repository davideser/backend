
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, RefreshToken, Role, Company, sequelize } = require('../models');
const blacklist = require('../utils/blacklist');
const Joi = require('joi');
const AppError = require('../utils/AppError');

// 📌 Funzione per generare un token JWT
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role.name },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// 📌 Login
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return next(new AppError('Username e password richiesti', 400));
    }
    const user = await User.findOne({
      where: { username },
      include: { model: Role, as: 'role' },
    });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return next(new AppError('Credenziali non valide', 401));
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = await RefreshToken.createToken(user);
    // Non restituire la password hashata
    const userSafe = { ...user.toJSON() };
    delete userSafe.password;
    res.status(200).json({ accessToken, refreshToken, user: userSafe });
  } catch (error) {
    next(new AppError('Errore nel login', 500));
  }
};

// 📌 Logout
exports.logout = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    blacklist.push(token); // Corretto: push invece di add
    await RefreshToken.destroy({ where: { userId: req.user.id } });
    res.status(200).json({ message: 'Logout effettuato con successo' });
  } catch (error) {
    next(new AppError('Errore nel logout', 500));
  }
};

// 📌 Refresh Token
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return next(new AppError('Refresh token richiesto', 400));
    const validToken = await RefreshToken.verifyToken(refreshToken);
    const user = await User.findByPk(validToken.userId);
    const newAccessToken = generateAccessToken(user);
    await validToken.destroy();
    const newRefreshToken = await RefreshToken.createToken(user);
    res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    next(new AppError(error.message, 401));
  }
};

// 📌 Recupera tutti gli utenti (con paginazione)
exports.getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows: users } = await User.findAndCountAll({
      attributes: ['id', 'username', 'email', 'roleId', 'companyId', 'status', 'createdAt'],
      include: [
        { model: Role, as: 'role', attributes: ['id', 'name'] },
        { model: Company, as: 'company', attributes: ['name'] }
      ],
      limit: parseInt(limit),
      offset
    });
    // Rimuovi la password da ogni utente
    const usersSafe = users.map(u => {
      const obj = { ...u.toJSON() };
      delete obj.password;
      return obj;
    });
    res.status(200).json({
      success: true,
      data: usersSafe,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    next(new AppError('Errore nel recupero utenti', 500));
  }
};

// 📌 Crea un nuovo utente o un partner con azienda associata (con validazione e transazione)
const userSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  roleId: Joi.number().required(),
  companyId: Joi.number().optional(),
  emailPartner: Joi.string().email().optional(),
  ragioneSociale: Joi.string().optional(),
  codiceFiscale: Joi.string().optional(),
  partitaIva: Joi.string().optional(),
});

exports.createUser = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const value = await userSchema.validateAsync(req.body);
    const { username, email, password, roleId, companyId } = value;
    let newCompanyId = companyId;
    if (Number(roleId) === 2 && !companyId) {
      const { emailPartner, ragioneSociale, codiceFiscale, partitaIva } = value;
      if (!ragioneSociale || !emailPartner || !codiceFiscale || !partitaIva) {
        await t.rollback();
        return next(new AppError('Tutti i campi aziendali sono obbligatori per i partner.', 400));
      }
      const newCompany = await Company.create(value, { transaction: t });
      newCompanyId = newCompany.id;
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      roleId,
      companyId: newCompanyId
    }, { transaction: t });
    await t.commit();
    const userSafe = { ...newUser.toJSON() };
    delete userSafe.password;
    res.status(201).json({ user: userSafe, companyId: newCompanyId });
  } catch (error) {
    await t.rollback();
    next(new AppError('Errore nella creazione utente', 500));
  }
};

// 📌 Recupera utente per ID
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId, { include: { model: Role, as: 'role' } });
    if (!user) return next(new AppError('Utente non trovato', 404));
    const userSafe = { ...user.toJSON() };
    delete userSafe.password;
    res.status(200).json(userSafe);
  } catch (error) {
    next(new AppError('Errore nel recupero utente', 500));
  }
};

// 📌 Aggiorna utente (solo Admin)
exports.updateUser = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'Admin') {
      return next(new AppError('Accesso negato', 403));
    }
    const { username, email, roleId } = req.body;
    const updated = await User.update(
      { username, email, roleId },
      { where: { id: req.params.userId } }
    );
    if (!updated[0]) return next(new AppError('Utente non trovato', 404));
    res.status(200).json({ message: 'Utente aggiornato con successo' });
  } catch (error) {
    next(new AppError('Errore nell\'aggiornamento utente', 500));
  }
};

// 📌 Elimina utente (solo Admin)
exports.deleteUser = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'Admin') {
      return next(new AppError('Accesso negato', 403));
    }
    const deleted = await User.destroy({ where: { id: req.params.userId } });
    if (!deleted) return next(new AppError('Utente non trovato', 404));
    res.status(200).json({ message: 'Utente eliminato con successo' });
  } catch (error) {
    next(new AppError('Errore nell\'eliminazione utente', 500));
  }
};

// 📌 Dichiarazione esplicita della funzione createPartner (con validazione Joi e transazione)
const partnerSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  roleId: Joi.number().required(),
  emailPartner: Joi.string().email().required(),
  ragioneSociale: Joi.string().required(),
  cap: Joi.string().required(),
  pv: Joi.string().required(),
  codiceFiscale: Joi.string().required(),
  partitaIva: Joi.string().required(),
  partnerType: Joi.string().required(),
  codiceUnivoco: Joi.string().required(),
  indirizzo: Joi.string().required(),
  capZip: Joi.string().required(),
  citta: Joi.string().required(),
  prov: Joi.string().required(),
  telefonoFisso: Joi.string().allow(null, ''),
  cellulare: Joi.string().required(),
});

exports.createPartner = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const value = await partnerSchema.validateAsync(req.body);
    const {
      username, email, password, roleId,
      emailPartner, ragioneSociale, cap, pv, codiceFiscale, partitaIva,
      partnerType, codiceUnivoco, indirizzo, capZip, citta, prov, telefonoFisso, cellulare
    } = value;

    // Creazione della compagnia in transazione
    const newCompany = await Company.create({
      name: ragioneSociale,
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
    }, { transaction: t });

    // Creazione utente associato in transazione
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      roleId,
      companyId: newCompany.id
    }, { transaction: t });

    await t.commit();
    const userSafe = { ...newUser.toJSON() };
    delete userSafe.password;
    res.status(201).json({ user: userSafe, company: newCompany });
  } catch (error) {
    await t.rollback();
    next(new AppError('Errore nella creazione del partner', 500));
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
