require('dotenv').config();   // Para leer las variables de .env
const mysql = require('mysql2/promise'); // Usamos mysql2 en modo promesa

// Creamos el pool de conexiones
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'pass123',
  database: process.env.DB_NAME || 'sibila',
  port: process.env.DB_PORT || 3307, // importante: puerto cambiado a 3307
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
