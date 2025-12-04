const express = require("express");
const respuesta = require("../../red/respuestas"); // Importamos el archivo de respuestas

const router = express.Router();
const config=require("../../config");
const controlador = require("./controladorDashboard"); // Importamos el controlador
const cacheKey=config.cacheKey;
// Ruta para obtener todos los items
router.get("/consultaretirostransito", async function (req, res,next) {
  let data = config.my_cache.get(cacheKey);


  if (data) {
        console.log('Datos desde cache');
        return respuesta.success(req, res, data); 
    }


  try {
    const items = await controlador.ctl_consultaRetirosEnTransito();
if (!items || items.length === 0) {
            // Evita el error items[0] si el arreglo está vacío.
            //config.my_cache.set(cacheKey, 0); 
            return respuesta.success(req, res,0, 200); 
        }

        config.my_cache.set(cacheKey, items); 

    respuesta.success(req, res, items, 200);
    // Llamamos al método todos del controlador
  } catch (err) {
    next(err);
  }
});


module.exports = router;