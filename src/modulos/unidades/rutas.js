const express = require("express");
const respuesta = require("../../red/respuestas"); // Importamos el archivo de respuestas

const router = express.Router();

const controlador = require("./controlador"); // Importamos el controlador


// Ruta para obtener todos los items
router.post("/ConsultaPorUnidad", async function (req, res,next) {
  
  const databusqueda =req.body.search; // Obtenemos el ID de la Unidad desde la consulta

  try {
    const items = await controlador.ctl_consulta_Por_unidad(databusqueda);
    respuesta.success(req, res, items, 200);
    // Llamamos al método todos del controlador
  } catch (err) {
    next(err);
  }
});
// Ruta para obtener un item por su id
/*
router.post("/BusquedaComponenteCodigoTINumSerie", async function (req, res,next) {
  //const databusqueda =req.body.codigoTI; 
  const databusqueda =req.query.dataBusqueda; // Obtenemos el código TI desde la consulta
  console.log("databusqueda",databusqueda);

  try {
    const items = await controlador.ctl_consulta_CodigoTI_Num_Serie(databusqueda);
    
    respuesta.success(req, res, items, 200);
  } catch (err) {
    next(err);
  }
});
*/

module.exports = router;
