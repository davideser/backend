const bcrypt = require('bcrypt');
const { sequelize, User, Role } = require('./models'); // ✅ Usa solo models!

async function createAdmin() {
  try {
    console.log('🔹 Connessione al database...');
    await sequelize.authenticate(); // ✅ Test della connessione
    console.log('✅ Connessione riuscita!');

    // Controlla se il ruolo "Admin" esiste
    let roleAdmin = await Role.findOne({ where: { name: 'Admin' } });

    // Se il ruolo non esiste, lo crea
    if (!roleAdmin) {
      console.log('⚠️ Ruolo Admin non trovato. Creazione in corso...');
      roleAdmin = await Role.create({ name: 'Admin' });
      console.log('✅ Ruolo Admin creato con successo.');
    }

    // Verifica se l'utente admin esiste già
    const existingUser = await User.findOne({ where: { username: 'admin' } });
    if (existingUser) {
      console.log('✅ L\'utente Admin esiste già.');
      return;
    }

    // Crea un nuovo utente Admin con password bcrypt
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    const newUser = await User.create({
      username: 'admin',
      password: hashedPassword,
      email: 'admin@admin.it',
      roleId: roleAdmin.id,
    });

    console.log('✅ Utente Admin creato con successo:', newUser.toJSON());
  } catch (error) {
    console.error('❌ Errore durante la creazione dell\'Admin:', error);
  } finally {
    await sequelize.close(); // ✅ Chiude la connessione al database
    console.log('🔌 Connessione chiusa.');
  }
}

createAdmin();
