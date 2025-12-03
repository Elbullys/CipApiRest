const express = require("express");
const morgan = require("morgan");
const config = require("./config");
const app = express();
const error = require("./red/errors");
const { loadUserData, requireAuth } = require('./middleware/authMiddleware');
const cors = require('cors');
const cookieParser = require('cookie-parser');


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
const reporteRetiros = require('./modulos/Reportes/ReporteRetiros/rutasReporteRetiro');





// Configuración de CORS
const allowedOrigins = [
  "http://localhost:3000",
  "https://controiinventariodeveloper.onrender.com"  // Asegúrate de que este sea tu dominio exacto de frontend
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
};

app.use(cors(corsOptions));
app.use(express.json());
// MIDDLEWARES
app.use(morgan('dev'));  // Cambiado: 'combined' en prod para logs más limpiosprocess.env.NODE_ENV === 'production' ? 

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(loadUserData);  // Aplica globalmente

// CONFIGURACION 
app.set('port', config.app.port);


// RUTAS
app.use('/api/componentes', requireAuth, componentes);
app.use('/api/unidades', requireAuth, unidades);
app.use('/api/areas', requireAuth, areas);
app.use('/api/dispositivos', requireAuth, dispositivos);
app.use('/api/CatalogosComponentes', catalogos_componentes);
app.use('/api/facturas', facturas);
app.use('/api/tecnicos', tecnicos);
app.use('/api/logintecnicos', logintecnico);
app.use('/api/movComponentes', MovComponentes);
app.use('/api/responsables', responsables);
app.use('/api/reportes/reporteretiro', reporteRetiros);

app.use(error);

module.exports = app;
