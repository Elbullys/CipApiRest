const express = require("express");
const respuesta = require("../../red/respuestas"); // Importamos el archivo de respuestas

const router = express.Router();

const controlador = require("./controlador"); // Importamos el controlador


// Ruta para obtener todos los items
router.get("/ConsultaComponentes", async function (req, res,next) {
  try {
    const items = await controlador.consulta_componente();
    respuesta.success(req, res, items, 200);
    // Llamamos al método todos del controlador
  } catch (err) {
    next(err);
  }
});
// Ruta para obtener un item por su id
router.post("/VerificarExistenciaComponente", async function (req, res,next) {
  //const databusqueda =req.body.codigoTI; 
  const databusqueda =req.query.dataBusqueda; // Obtenemos el código TI desde la consulta
  try {
    const items = await controlador.ctl_verificar_id_componente_QR_Num_Serie(databusqueda);

    respuesta.success(req, res, items, 200);
  } catch (err) {
    next(err);
  }
});

router.post("/BusquedaComponenteCodigoTINumSerie", async function (req, res,next) {
  //const databusqueda =req.body.codigoTI; 
  const databusqueda =req.query.dataBusqueda; // Obtenemos el código TI desde la consulta
  console.log("databusqueda",databusqueda);

  try {
    const items = await controlador.ctl_consulta_id_componente_QR_Num_Serie(databusqueda);

    respuesta.success(req, res, items, 200);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
