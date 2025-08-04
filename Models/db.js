const mysql = require("mysql2/promise"); // Usa la versión con promesas

// Crear un pool de conexiones
const pool = mysql.createPool({
  host: process.env.HOST,
  database: process.env.DBNAME,
  user: process.env.USER,
  password: process.env.PASSWORD,
  waitForConnections: true,
  connectionLimit: 50, // Ajusta según necesidad
  queueLimit: 0
});

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

// Exportar la función para obtener conexiones
module.exports = { getConnection };





/*const mysql= require("mysql2");
//CONEXION A BASE DE DATOS

const connection = mysql.createConnection({
  host     : process.env.HOST,
  database : process.env.DBNAME,
  user     : process.env.USER,
  password : process.env.PASSWORD
});

connection.connect((err)=>{
  if(err)
  {
    throw err;
    //console.log(err.message);
  }
  console.log("conexion satisfactoria bd");
})*/
/*
const createconnection = () =>{
  return new Promise((resolve, reject) => {
  connection.connect(function(err){
    if(console.err){
      reject(err);
      
    }
    else
    {
      resolve(connection);
    }
  });
});
}

const ClosedConnection= () => {
  return new Promise((resolve, reject) => {
    connection.end(err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}*/
module.exports = connection;

