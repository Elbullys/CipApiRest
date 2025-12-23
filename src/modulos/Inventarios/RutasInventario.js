const express = require("express");
const respuesta = require("../../red/respuestas"); // Importamos el archivo de respuestas

const router = express.Router();

const controlador = require("./ControladorInventario"); // Importamos el controlador

//CONSULTA PARA OBTENER LOS DATOS DE LOS COMPONENTES DE INVENTARIO COLECTIVO
router.get("/ComponentesPorColectivo", async function (req, res,next) {
  const BusquedaEncabezados = req.query;

  console.log("BusquedaEncabezados en rutas:", BusquedaEncabezados);
  try {
    const items = await controlador.ctl_InventarioComponentesPorColectivo(BusquedaEncabezados);
    respuesta.success(req, res, items, 200);
    // Llamamos al método todos del controlador
  } catch (err) {
    next(err);
  }
});


module.exports = router;