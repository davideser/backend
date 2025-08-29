require('dotenv').config(); // Carica le variabili di ambiente dal file .env

const http = require('http');
const app = require('./app');
const port = process.env.PORT || 3000;

console.log('JWT_SECRET:', process.env.JWT_SECRET); // Log di debug per verificare che JWT_SECRET sia caricato

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
