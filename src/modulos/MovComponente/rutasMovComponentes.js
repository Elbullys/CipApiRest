const express = require("express");
const respuesta = require("../../red/respuestas"); // Importamos el archivo de respuestas

const router = express.Router();

const controlador = require("./controladorMovComponente"); // Importamos el controlador
/****************************************************************************************************** */
//CONSULTAS
/****************************************************************************************************** */


/****************************************************************************************************** */
//UPDATE
/****************************************************************************************************** */


/****************************************************************************************************** */
//INSERT
/****************************************************************************************************** */
router.post("/AgregarMovimientoComponente", async function (req, res,next) {
  
    const componenteMovAnterior = req.session.componenteMovAnterior; 
    const componenteMovFinal=req.session.componenteMovFinal;
    const idtecnico =req.session.SesionIdTecnico;
  try {

   const response = await controlador.ctl_AgregarMovimientoComponente(componenteMovAnterior,componenteMovFinal,idtecnico);
        if (response.error) {
            return res.status(409).json(response); // Devuelve un error 400 si el usuario está duplicado
        }
        return res.status(201).json(response); // 201 para creación exitosa
  } catch (err) {
    next(err);
  }  
});
//ctl_Editar_ComponentePorID
module.exports = router;
