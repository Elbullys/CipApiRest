const express = require("express");
const respuesta = require("../../red/respuestas"); // Importamos el archivo de respuestas

const router = express.Router();

//const config=require("../config");
const controlador = require("./controladorReporteRetiro"); // Importamos el controlador
 


router.get("/ConsultaTotalRetirosEnTransito", async function (req, res, next) {
    //const cacheKey = config.cacheKey; // Alias para mayor claridad
/*
    // 1. INTENTA OBTENER DATOS DE LA CACHÉ
    let data = config.my_cache.get(cacheKey);

    if (data) {
        // Si hay datos en caché, envíalos DIRECTAMENTE
        // Ya que guardaremos un objeto/valor JS (no una cadena JSON)
        console.log('Datos desde cache');
        return respuesta.success(req, res, data); 
    }
*/
    // 2. SI NO HAY CACHÉ, CONSÚLTA LA BASE DE DATOS
    try {
        const items = await controlador.ctl_consulta_TotalRetirosEnTransito();
        
        // 🛑 VALIDACIÓN (como se recomendó antes) 🛑
        if (!items || items.length === 0) {
            // Evita el error items[0] si el arreglo está vacío.
            //config.my_cache.set(cacheKey, 0); 
            return respuesta.success(req, res, 0); 
        }

        // 3. ALMACENAR DATOS SIN JSON.stringify()
        // Guarda el objeto o el valor que quieras enviar. 
        // Si quieres enviar el arreglo completo:
        //config.my_cache.set(cacheKey, items); 
        
        //console.log('Valor guardado en cache:', items);

        // 4. ENVÍA LA RESPUESTA
        // Envía el objeto/arreglo que acabas de guardar.
        respuesta.success(req, res, items,200); 

    } catch (err) {
        // En caso de error de DB o procesamiento
        next(err);
    }
});

module.exports = router;
