const express = require("express");
const respuesta = require("../../../red/respuestas"); // Importamos el archivo de respuestas
 
const router = express.Router();

const config=require("../../../config");
const controlador = require("./controladorReporteRetiro"); // Importamos el controlador
 


router.get("/ConsultaTotalRetirosEnTransito", async function (req, res,next) {
  // Verifica si myCache es válido (para depuración)
       

    let data = config.my_cache.get(config.cacheKey);
    if (data) {
      console.log('Datos desde cache');
      return res.json(data);
    }
   //const id_unidad = req.query.id_unidad; // Obtenemos ID unidad desde la consulta
  //const searchTerm = req.query.searchTerm; // Obtenemos el area a buscar desde la consulta
  try {
  
    const items = await controlador.ctl_consulta_TotalRetirosEnTransito();
    config.my_cache.set(config.cacheKey, items[0].EquiposEnTransito);
    const EquiposEnTransito=items[0].EquiposEnTransito;
    respuesta.success(req, res, EquiposEnTransito, 200);
    // Llamamos al método todos del controlador
  } catch (err) {
    next(err);
  }
});

module.exports = router;
