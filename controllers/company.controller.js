const Company = require('../models/company');

exports.createPartner = async (req, res) => {
  try {
    const { 
      username, email, password, roleId,
      emailPartner, ragioneSociale, cap, pv, codiceFiscale, partitaIva, 
      partnerType, codiceUnivoco, indirizzo, capZip, citta, prov, telefonoFisso, cellulare 
    } = req.body;

    // Validazione campi obbligatori
    if (!username || !email || !password || !roleId) {
      return res.status(400).json({ message: 'Campi obbligatori mancanti' });
    }

    if (Number(roleId) !== 2) {
      return res.status(400).json({ message: 'Solo i partner possono avere una compagnia' });
    }

    // Verifica campi partner
    const requiredFields = [emailPartner, ragioneSociale, cap, pv, codiceFiscale, partitaIva, partnerType, codiceUnivoco, indirizzo, capZip, citta, prov, telefonoFisso, cellulare];
    if (requiredFields.some(field => !field)) {
      return res.status(400).json({ message: 'Tutti i campi del partner sono obbligatori' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newCompany = await Company.create({
      name: ragioneSociale,  // ✅ Corretto
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
