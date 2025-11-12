const express = require("express");
const respuesta = require("../../red/respuestas"); // Importamos el archivo de respuestas

const router = express.Router();

const controlador = require("./controladorDispositivos"); // Importamos el controlador

// Ruta para obtener todos los items
router.get("/ConsultaTodosDispositivos", async function (req, res,next) {
  try {
    const items = await controlador.ctl_consulta_TODOS_dispositivos();
    respuesta.success(req, res, items, 200);
    // Llamamos al método todos del controlador
  } catch (err) {
    next(err);
  }
});
// Ruta para obtener todos los items
router.get("/ConsultaPorDispositivosBusqueda", async function (req, res,next) {
  const searchTerm = req.query.searchTerm; // Obtenemos el area a buscar desde la consulta
  try {
    const items = await controlador.ctl_consulta_Por_Dispositivo_Busqueda(searchTerm);
    respuesta.success(req, res, items, 200);
    // Llamamos al método todos del controlador
  } catch (err) {
    next(err);
  }
});

module.exports = router;