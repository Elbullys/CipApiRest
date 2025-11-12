const express = require("express");
const respuesta = require("../../red/respuestas"); // Importamos el archivo de respuestas

const router = express.Router();

const controlador = require("./controladorAreas"); // Importamos el controlador

// Ruta para obtener todos los items
router.get("/ConsultaAreaPorTipoUnidad", async function (req, res,next) {
  
   const TipoUnidad = req.query.TipoUnidad; // Obtenemos tipo unidad desde la consulta
  const searchTerm = req.query.searchTerm; // Obtenemos el area a buscar desde la consulta
  try {
  
    const items = await controlador.ctl_consulta_Area_Por_TipoUnidad(TipoUnidad,searchTerm);
    respuesta.success(req, res, items, 200);
    // Llamamos al método todos del controlador
  } catch (err) {
    next(err);
  }
});

// Ruta para obtener todos los items
router.get("/ConsultaTodasAreasPorTipoUnidad", async function (req, res,next) {
  
   const TipoUnidad = req.query.TipoUnidad; // Obtenemos id unidad desde la consulta

  try {
    const items = await controlador.ctl_consulta_Todas_Areas_Por_TipoUnidad(TipoUnidad);
    respuesta.success(req, res, items, 200);
    // Llamamos al método todos del controlador
  } catch (err) {
    next(err);
  }
});
module.exports = router;