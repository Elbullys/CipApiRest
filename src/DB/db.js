const mysql = require("mysql2/promise");
const config = require("../config");

const dbconfig = {
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
  waitForConnections: true,
  connectTimeout: 60000,  // 60 segundos (aumenta de ~10s por defecto)
  connectionLimit: 5, // Ajusta según necesidad

  queueLimit: 0
};

// Crear un pool de conexiones
const pool = mysql.createPool(dbconfig);

// Función para obtener una conexión del pool
async function getConnection() {

  try {
    const connection = await pool.getConnection();
    console.log("Conexión satisfactoria");
    return connection;
  } catch (err) {
    console.error('Error al conectar:', err);
    throw err; // Lanza el error para manejarlo más arriba
  }
}

module.exports = { getConnection };