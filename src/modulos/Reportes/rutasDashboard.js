const express = require("express");
const respuesta = require("../../red/respuestas"); // Importamos el archivo de respuestas

const router = express.Router();
const config=require("../../config");
const controlador = require("./controladorDashboard"); // Importamos el controlador
const controladorRetiroEquipo=require("./ReporteRetiros/controladorReporteRetiro");
const controladorMantenimientoCorrectivo=require("./ReporteMantenimientoCorrectivo/controladorMantCorrectivo");
const controladorMovComponente=require("../MovComponente/controladorMovComponente");
const controladorMantenimientoPreventivo=require("./ReporteMantenimientoPreventivo/controladorMantPreventivo");
const controladorComponentes=require("../componentes/controladorComponentes");
///ctl_consulta_conteo_componentes_ActivoBaja

const cacheKey=config.cacheKey;
const cacheKeyChart=config.cacheKeyChart;
const cacheKeyChartActivoBaja=config.cacheKeyChart;
// Ruta para obtener todos los items

router.get("/reporteDashboard/ConsultaComponentesChartConteoActivoBaja", async function (req, res,next) {
  let data = config.my_cache.get(cacheKeyChartActivoBaja);
  if (data) {
        console.log('Datos desde cache CHART ACTIVO BAJA');
        return respuesta.success(req, res, data); 
    }
  try {
    const itemsChart = await controladorComponentes.ctl_consulta_conteo_componentes_ActivoBaja();
    config.my_cache.set(cacheKeyChartActivoBaja, itemsChart); 
    respuesta.success(req, res, itemsChart, 200);
    // Llamamos al método todos del controlador
  } catch (err) {
    next(err);
  }
});
router.get("/reporteDashboard/ConsultaComponentesChartCoteoTipoUnidad", async function (req, res,next) {
  let data = config.my_cache.get(cacheKeyChart);
  if (data) {
        console.log('Datos desde cache CHART');
        return respuesta.success(req, res, data); 
    }
  try {
    const itemsChart = await controladorComponentes.ctl_consulta_conteo_componentes_TipoUnidad();
    config.my_cache.set(cacheKeyChart, itemsChart); 
    respuesta.success(req, res, itemsChart, 200);
    // Llamamos al método todos del controlador
  } catch (err) {
    next(err);
  }
});



router.get("/reporteDashboard/consultaretirostransito", async function (req, res,next) {
  let data = config.my_cache.get(cacheKey);


  if (data) {
        console.log('Datos desde cache');
        return respuesta.success(req, res, data); 
    }


  try {
    //controladorMovComponente
    const itemsConteoRetiroEnTransito = await controladorRetiroEquipo.ctl_consulta_TotalRetirosEnTransito();
    const itemsConteoTotalMovimientoComponente = await controladorMovComponente.ctl_consulta_Conteo_MovimientosPorDia();
    const itemsConteoTotalMantCorrectivo = await controladorMantenimientoCorrectivo.ctl_consulta_Conteo_MantenimientoCorrectivo();
    const itemsConteoTotalMantPreventivo = await controladorMantenimientoPreventivo.ctl_consulta_Conteo_MantenimientoPreventivo();
// Validación mejorada: Verifica que TODOS sean arrays no vacíos
     // Crear un objeto con todos los conteos
        const conteos = {
               retiroEnTransito: itemsConteoRetiroEnTransito?.[0]?.EquiposEnTransito || 0,  // Número directo
               movimientoComponente: itemsConteoTotalMovimientoComponente?.[0]?.count || 0,
               mantenimientoCorrectivo: itemsConteoTotalMantCorrectivo?.[0]?.ConteoTotalMantCorrectivo || 0,  // 83
               mantenimientoPreventivo: itemsConteoTotalMantPreventivo?.[0]?.ConteoTotalMantPreventivo || 0  // Ajusta la clave
           };

        config.my_cache.set(cacheKey, conteos); 

    respuesta.success(req, res, conteos, 200);
    // Llamamos al método todos del controlador
  } catch (err) {
    next(err);
  }
});


module.exports = router;