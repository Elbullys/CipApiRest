const express = require("express");
const respuesta = require("../../red/respuestas"); // Importamos el archivo de respuestas

const router = express.Router();

const controlador = require("./controladorResponsables"); // Importamos el controlador


router.get("/ConsultaResponsablePorUnidad", async function (req, res,next) {
  
   const id_unidad = req.query.id_unidad; // Obtenemos ID unidad desde la consulta
  const searchTerm = req.query.searchTerm; // Obtenemos el area a buscar desde la consulta
  try {
  
    const items = await controlador.ctl_consulta_ResponsablePorUnidad(id_unidad,searchTerm);
    respuesta.success(req, res, items, 200);
    // Llamamos al método todos del controlador
  } catch (err) {
    next(err);
  }
});
// Ruta para obtener todos los items
router.get("/ConsultaTodosResponsablePorIDUnidad", async function (req, res,next) {
  
   const id_unidad = req.query.id_unidad; // Obtenemos id unidad desde la consulta

  try {
    const items = await controlador.ctl_ConsultaTodosResponsablePorIDUnidad(id_unidad);
    respuesta.success(req, res, items, 200);
    // Llamamos al método todos del controlador
  } catch (err) {
    next(err);
  }
});


module.exports = router;
