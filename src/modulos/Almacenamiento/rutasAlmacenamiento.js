const express = require("express");
const respuesta = require("../../red/respuestas"); // Importamos el archivo de respuestas

const router = express.Router();

const controlador = require("./controladorAlmacenamiento"); // Importamos el MemoriaRam


// Ruta para obtener todos los items
router.get("/consulta_Todos_DiscoDuro_busqueda", async function (req, res,next) {
  const searchTerm = req.query.searchTerm; // Obtenemos el procesador a buscar desde la consulta


  try {
    const items = await controlador.ctl_consulta_Todos_DiscoDuro_busqueda(searchTerm);
    respuesta.success(req, res, items, 200);
    // Llamamos al método todos del controlador
  } catch (err) {
    next(err);
  }
});

module.exports = router;