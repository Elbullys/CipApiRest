const express = require("express");
const respuesta = require("../../../red/respuestas"); // Importamos el archivo de respuestas
 
const router = express.Router();


const controlador = require("./controladorMantCorrectivo"); // Importamos el controlador
 


/*router.get("/ConteoTotalRetirosEnTransito", async function (req, res,next) {
  // Verifica si myCache es válido (para depuración)

  try {
  
    const items = await controlador.ctl_consulta_TotalRetirosEnTransito();
    respuesta.success(req, res, items, 200);
    // Llamamos al método todos del controlador
  } catch (err) {
    next(err);
  }
});*/

module.exports = router;
