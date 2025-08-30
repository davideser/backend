require('dotenv').config(); // Carica le variabili d'ambiente
const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); // Aggiunto helmet per la sicurezza
const app = express();

// Controlla che le variabili d'ambiente obbligatorie siano definite
if (!process.env.JWT_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
  throw new Error('JWT_SECRET e REFRESH_TOKEN_SECRET devono essere definite nelle variabili d\'ambiente');
}

// Configura CORS con controllo dinamico degli origin
const allowedOrigins = process.env.NODE_ENV === 'development' 
  ? ['http://localhost', 'http://localhost:3030', 'http://localhost:3000']
  : ['https://tuo-dominio.com']; // In produzione, consenti solo il dominio ufficiale

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origin non consentito dal CORS'));
    }
  },
  credentials: true, // Aggiunto per abilitare l'invio dei cookie nelle richieste cross-origin
}));

app.use(helmet()); // Aggiunge intestazioni di sicurezza HTTP
app.use(express.json()); // Parsing delle richieste JSON

// Debug: Log per confermare il caricamento, visibile solo in ambiente di sviluppo
if (process.env.NODE_ENV === 'development') {
  console.log('Environment: Development');
  console.log('Middleware e variabili di ambiente configurati.');
}

// Importa le rotte
const BarcheRoute = require('./routes/barche');
const ServiziRoute = require('./routes/servizi');
const EventRoute = require('./routes/event');
const TariffaRoute = require('./routes/tariffa');
const UserRoute = require('./routes/user');
const RoleRoute = require('./routes/role'); // Importa la route per roles
const PartnerCreateRoute = require('./routes/partnerCreate'); // Importa la route per la creazione partner

// Associazione delle rotte
app.use("/api/barche", BarcheRoute);
app.use("/api/servizi", ServiziRoute);
app.use("/api/events", EventRoute);
app.use("/api/tariffe", TariffaRoute);
app.use("/api/users", UserRoute);
app.use("/api/roles", RoleRoute); // Registra la route per roles
app.use("/api/partners", PartnerCreateRoute); // Registra la route per la creazione partner

// Debug: Conferma delle rotte caricate
if (process.env.NODE_ENV === 'development') {
  console.log('Rotte caricate correttamente.');
}

// Gestione degli errori per rotte non trovate
app.use((req, res, next) => {
  res.status(404).json({
    message: 'Risorsa non trovata',
    requestedUrl: req.originalUrl,
  });
});

// Middleware per la gestione degli errori
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

// Esporta l'app per il server
module.exports = app;
