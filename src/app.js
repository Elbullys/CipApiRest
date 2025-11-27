const express = require("express");
const morgan = require("morgan");
const config = require("./config");
const app = express();
const error = require("./red/errors");
const { loadUserData,checkAuth } = require('./middleware/authMiddleware');
const cors = require('cors');
const componentes = require('./modulos/componentes/rutasComponentes');
const unidades = require('./modulos/unidades/rutasUnidades');
const areas = require('./modulos/Areas/rutasAreas');
const dispositivos = require('./modulos/Dispositivos/rutasDispositivos');
const catalogos_componentes = require('./modulos/Catalogos/rutasCatalogosComponentes');
const facturas = require('./modulos/Facturas/rutasFacturas');
const tecnicos = require('./modulos/Tecnicos/rutasTecnicos');
const logintecnico = require('./modulos/Autenticacion/rutasLoginTecnicos');
const MovComponentes = require('./modulos/MovComponente/rutasMovComponentes');
const responsables = require('./modulos/Responsables/rutasResponsables');
const cookieParser = require('cookie-parser');
const session = require('express-session');

// Configuración básica de la sesión
app.use(session({
    secret: process.env.SESSION_SECRET||'tu_secreto_muy_seguro_aqui', 
    resave: false, // Evita guardar la sesión si no ha sido modificada
    saveUninitialized: false, // Evita crear sesiones para usuarios no autenticados o no modificados
    cookie: { 
        secure: false, // Cambia a true si usas HTTPS en producción
        maxAge: 1000 * 60 * 60 * 24 // Ejemplo: 1 día de duración
    }
}));

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
  credentials: true,
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept","Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
};

// Usar el middleware CORS con las opciones configuradas
app.use(cors(corsOptions));

// MIDDLEWARES
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Esto habilita req.cookies

app.use(loadUserData);  // Aplica globalmente
// CONFIGURACION 
app.set('port', config.app.port);

// RUTAS
app.use('/api/componentes', checkAuth,componentes);
app.use('/api/unidades', checkAuth,unidades);
app.use('/api/areas',checkAuth, areas);
app.use('/api/dispositivos', checkAuth,dispositivos);
app.use('/api/CatalogosComponentes', catalogos_componentes);
app.use('/api/facturas', facturas);
app.use('/api/tecnicos', tecnicos);
app.use('/api/logintecnicos', logintecnico);
app.use('/api/movComponentes', MovComponentes);
app.use('/api/responsables', responsables);

app.use(error);

module.exports = app;
