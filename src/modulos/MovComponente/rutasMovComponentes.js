const express = require("express");
const respuesta = require("../../red/respuestas"); // Importamos el archivo de respuestas

const router = express.Router();

const controlador = require("./controladorMovComponente"); // Importamos el controlador
const controladorComponentes = require("../componentes/controladorComponentes")
/****************************************************************************************************** */
//CONSULTAS
/****************************************************************************************************** */


/****************************************************************************************************** */
//UPDATE
/****************************************************************************************************** */


/****************************************************************************************************** */
//INSERT
/****************************************************************************************************** */
router.post("/AgregarMovimientoComponente", async function (req, res, next) {

  const componenteMovAnterior = req.session.componenteMovAnterior;
  const componenteMovFinal = req.session.componenteMovFinal;
  const idtecnico = req.session.SesionIdTecnico;
  try {

    const response = await controlador.ctl_AgregarMovimientoComponente(componenteMovAnterior, componenteMovFinal, idtecnico);
    if (response.error) {
      return res.status(409).json(response); // Devuelve un error 400 si el usuario está duplicado
    }
    return res.status(201).json(response); // 201 para creación exitosa
  } catch (err) {
    next(err);
  }
});

router.post("/Inventario/AgregarMovimientoComponenteColectivoArray", async function (req, res, next) {
  const  seriesInfo = req.body; // seriesInfo es el array del Excel procesado


  try {
    // 1. Consultamos como están los componentes actualmente en la BD (para el historial_origen)
    const componentesBD = await controladorComponentes.ctl_consultaComponentesColectivoArray(seriesInfo);

   
    // 2. Ejecutamos la carga colectiva con transacción
    const response = await controlador.ctl_AgregarMovimientoColectivoComponenteArray(
      seriesInfo,
      componentesBD
    );

    if (response.error) {
      return res.status(400).json(response);
    }
    return res.status(201).json(response);

  } catch (err) {
    next(err);
  }
});
//ctl_Editar_ComponentePorID
module.exports = router;
