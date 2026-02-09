const express = require("express");
const respuesta = require("../../red/respuestas"); // Importamos el archivo de respuestas

const router = express.Router();

const controlador = require("./controladorMarcaModelo"); // Importamos el controlador

// Ruta para obtener todos los items
/*
router.get("/ConsultaTodosDispositivos", async function (req, res,next) {
  try {
    const items = await controlador.ctl_consulta_TODOS_dispositivos();
    respuesta.success(req, res, items, 200);
    // Llamamos al método todos del controlador
  } catch (err) {
    next(err);
  }
});*/
// Ruta para obtener todos los items
router.get("/ctl_consulta_Por_MarcaModelo_BusquedaPorDispositivo", async function (req, res,next) {
  const searchTerm = req.query.searchTerm; // Obtenemos el area a buscar desde la consulta
  const FK_dispositivo = req.query.FK_dispositivo
  ; // Obtenemos el area a buscar desde la consulta
  console.log(FK_dispositivo);
  try {
    const items = await controlador.ctl_consulta_Por_MarcaModelo_BusquedaPorDispositivo(searchTerm,FK_dispositivo);
    respuesta.success(req, res, items, 200);
    // Llamamos al método todos del controlador
  } catch (err) {
    next(err);
  }
});

module.exports = router;