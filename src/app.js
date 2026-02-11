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
const MarcaModelo = require('./modulos/Marca_Modelo/rutasMarcaModelo');
const procesador= require('./modulos/Procesador/rutasProcesador');
const MemoriaRam= require('./modulos/Memoria_Ram/rutasMemoriaRam');
const Almacenamiento= require('./modulos/Almacenamiento/rutasAlmacenamiento');
const SistemaOperativo= require('./modulos/Sistema_operativo/rutasSistemaOperativo');
const catalogos_componentes = require('./modulos/Catalogos/rutasCatalogosComponentes');
const facturas = require('./modulos/Facturas/rutasFacturas');
const tecnicos = require('./modulos/Tecnicos/rutasTecnicos');
const logintecnico = require('./modulos/Autenticacion/rutasLoginTecnicos');
const MovComponentes = require('./modulos/MovComponente/rutasMovComponentes');
const responsables = require('./modulos/Responsables/rutasResponsables');
const reporteDashboard = require('./modulos/Reportes/rutasDashboard');
const inventarios = require('./modulos/Inventarios/RutasInventario');





// Configuración de CORS
const allowedOrigins = [
  "http://localhost:3000",
  "https://controiinventariodeveloper.onrender.com",  //frontend
  "https://appcip.onrender.com/"
  
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
app.use('/api/componentes',requireAuth, componentes);
app.use('/api/unidades',requireAuth, unidades);
app.use('/api/areas', requireAuth,areas);
app.use('/api/dispositivos', requireAuth, dispositivos);
app.use('/api/MarcaModelo', requireAuth, MarcaModelo);
app.use('/api/CatalogosComponentes',requireAuth, catalogos_componentes);
app.use('/api/procesador',requireAuth, procesador);
app.use('/api/MemoriaRam',requireAuth, MemoriaRam);
app.use('/api/Almacenamiento', Almacenamiento);
app.use('/api/SistemaOperativo',requireAuth, SistemaOperativo);
app.use('/api/facturas',requireAuth, facturas);
app.use('/api/tecnicos',requireAuth, tecnicos);
app.use('/api/logintecnicos', logintecnico);
app.use('/api/movComponentes',requireAuth, MovComponentes);
app.use('/api/responsables', requireAuth,responsables);
app.use('/api/reportes',requireAuth, reporteDashboard);
app.use('/api/inventarios', requireAuth,inventarios);


app.use(error);

module.exports = app;
