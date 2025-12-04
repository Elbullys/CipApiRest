const express = require("express");
const respuesta = require("../../red/respuestas"); // Importamos el archivo de respuestas

const router = express.Router();

const controlador = require("./controladorDashboard"); // Importamos el controlador

// Ruta para obtener todos los items
router.get("/consultaretirostransito", async function (req, res,next) {
  try {
    const items = await controlador.ctl_consultaRetirosEnTransito();
    respuesta.success(req, res, items, 200);
    // Llamamos al método todos del controlador
  } catch (err) {
    next(err);
  }
});


module.exports = router;