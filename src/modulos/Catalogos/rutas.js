const express = require("express");
const respuesta = require("../../red/respuestas"); // Importamos el archivo de respuestas

const router = express.Router();

const controlador = require("./controlador"); // Importamos el controlador

// Ruta para obtener todos los items
router.get("/ConsultaCatalogosPorDispositivoBusqueda", async function (req, res,next) {
  
   const IdDispositivo = req.query.IdDispositivo; // Obtenemos tipo unidad desde la consulta
  const searchTerm = req.query.searchTerm; // Obtenemos el area a buscar desde la consulta
  try {
  
    const items = await controlador.ctl_consulta_Catalogos_Por_Dispositivo_Busqueda(IdDispositivo,searchTerm);
    respuesta.success(req, res, items, 200);
    // Llamamos al método todos del controlador
  } catch (err) {
    next(err);
  }
});

// Ruta para obtener todos los items
router.get("/ConsultaTodosCatalogoPorDispositivo", async function (req, res,next) {
  
   const IdDispositivo = req.query.IdDispositivo; // Obtenemos id unidad desde la consulta

  try {
    const items = await controlador.ctl_consulta_Todos_Catalogos_Por_Dispositivo(IdDispositivo);
    respuesta.success(req, res, items, 200);
    // Llamamos al método todos del controlador
  } catch (err) {
    next(err);
  }
});
module.exports = router;