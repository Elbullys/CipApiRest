const express = require("express");
const morgan = require("morgan");
const config = require("./config");
const app = express();
const componentes = require('./modulos/componentes/rutas');
const error = require("./red/errors");
const cors = require('cors');

// Configuración de CORS
const allowedOrigins = [
  "http://localhost:3000",
  "https://controiinventariodeveloper.onrender.com"
];

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir solicitudes sin origen (por ejemplo, desde Postman)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"]
};

// Usar el middleware CORS con las opciones configuradas
app.use(cors(corsOptions));

// MIDDLEWARES
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CONFIGURACION 
app.set('port', config.app.port);

// RUTAS
app.use('/api/componentes', componentes);

app.use(error);

module.exports = app;

//const mysql= require("mysql2");
//require('dotenv').config()
//var cors = require('cors');
// app.use(express.json());
//app.use(cors());
//require('dotenv').config()
//CONFIGURAR CABECERAS Y CORDS
/*app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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
});

//APIS DE LA APP
app.get("/", (req, res) => {
    res.send("Hola Mundo");
  });

//MOSTRAR TODOS LOS COMPONENTES
  app.get('/api/componentes', (req, res) => {
  connection.query('SELECT U.id_unidad,R.nombre_responsable,U.nombre_unidad,D.tipo_equipo,M.marca,M.modelo,C.numero_serie,C.operacion,C.codigo_TI,C.observaciones,C.status_componente,A.area,C.status_inventario FROM componentes C INNER JOIN unidad U ON U.id_unidad=C.FK_id_unidad INNER JOIN RESPONSABLE R ON R.id_responsable=C.FK_id_responsable INNER JOIN CATALOGO_COMPONENTES CC ON CC.id_catalogo_componente=C.FK_id_catalogo_componentes INNER JOIN MARCA M ON M.id_marca=CC.FK_id_marca_cata INNER JOIN dispositivos D ON D.id_dispositivo=C.FK_id_dispositivo INNER JOIN AREA A ON A.id_area=R.FK_id_area', (err, rows) => {
    if (err) {
      console.log(err);
      
    } else {
      res.send(rows);
    }
  });

});



const port =process.env.PORT || 7000;
//require('dotenv').config()

app.listen(port, () => {
    console.log('Servidor a su servicio en el puerto', port);
  })*/