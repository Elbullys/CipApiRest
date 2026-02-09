const express = require("express");
const respuesta = require("../../red/respuestas"); // Importamos el archivo de respuestas

const router = express.Router();

const controlador = require("./controladorCatalogosComponentes"); // Importamos el controlador
const { requireAuth } = require('../../middleware/authMiddleware');

/****************************************************************************************************** */
//CONSULTAR
/****************************************************************************************************** */
// Ruta para obtener todos los items
router.get("/ConsultaCatalogosPorDispositivoBusqueda",requireAuth, async function (req, res,next) {
  
   const IdDispositivo = req.query.IdDispositivo; // Obtenemos tipo unidad desde la consulta
  const searchTerm = req.query.searchTerm; // Obtenemos el area a buscar desde la consulta
  try {
  
    const items = await controlador.ctl_consulta_Catalogos_Por_Dispositivo_Busqueda(IdDispositivo,searchTerm);
    respuesta.success(req, res, items, 200);
    // Llamamos al método todos del controlador
  } catch (err) {
    next(err);
  }
});

// Ruta para obtener todos los items
router.get("/ConsultaTodosCatalogoPorDispositivo", requireAuth,async function (req, res,next) {
  
   const IdDispositivo = req.query.IdDispositivo; // Obtenemos id unidad desde la consulta

  try {
    const items = await controlador.ctl_consulta_Todos_Catalogos_Por_Dispositivo(IdDispositivo);
    respuesta.success(req, res, items, 200);
    // Llamamos al método todos del controlador
  } catch (err) {
    next(err);
  }
});

//CONSULTAR CATALOGO POR ID COMPONENTE
router.get("/ConsultaCatalogoPorID", async function (req, res,next) {
  
   
  const Id_catalogo_componente = req.query.searchTerm; // Obtenemos el area a buscar desde la consulta
  console.log("searchTerm",Id_catalogo_componente);
  try {
  
    const items = await controlador.ctl_ConsultaCatalogoPorID(Id_catalogo_componente);
    respuesta.success(req, res, items, 200);
    // Llamamos al método todos del controlador
  } catch (err) {
    next(err);
  }
});

//CONSULTAR CATALOGO COMPONENTES TODOS CON BUQUEDA
router.get("/ConsultaTodosCatalogosBusqueda", requireAuth, async function (req, res,next) {
  
   
  const searchTerm = req.query.searchTerm; // Obtenemos el area a buscar desde la consulta
  console.log("searchTerm",searchTerm);
  try {
  
    const items = await controlador.ctl_ConsultaTodosCatalogosBusqueda(searchTerm);
    respuesta.success(req, res, items, 200);
    // Llamamos al método todos del controlador
  } catch (err) {
    next(err);
  }
});


/****************************************************************************************************** */
//INSERT
/****************************************************************************************************** */
router.post("/InsertaryVerificarCatalogoComponente", requireAuth, async function (req, res,next) {
  const DataCatalogoComponentes = req.body;
  try {
    const resultado = await controlador.ctl_InsertaryVerificarCatalogoComponente(DataCatalogoComponentes);
    respuesta.success(req, res, resultado, 201);
  } catch (err) {
    next(err);
  }
});

/****************************************************************************************************** */
//UPDATE
/****************************************************************************************************** */
router.put("/EditarCatalogoComponentesPorId/:id_catalogo_componente", async function (req, res, next) {
   const id_catalogo_componente = parseInt(req.params.id_catalogo_componente, 10);
   const dataCatalogoComponente = req.body;

  console.log("ID COMPONENTE A EDITAR:", id_catalogo_componente);
  console.log("COMPONENTE data:", dataCatalogoComponente);

  try {
    const result = await controlador.ctl_EditarCatalogoComponentesPorId(id_catalogo_componente, dataCatalogoComponente);
    respuesta.success(req, res, result, 200); // 200 para actualización exitosa
  } catch (err) {
    next(err);
  }
});

module.exports = router;