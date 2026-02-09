const express = require("express");
const respuesta = require("../../red/respuestas"); // Importamos el archivo de respuestas

const router = express.Router();

const controlador = require("./controladorResponsables"); // Importamos el controlador


router.get("/ConsultaResponsablePorUnidad", async function (req, res,next) {
  
   const id_unidad = req.query.id_unidad; // Obtenemos ID unidad desde la consulta
  const searchTerm = req.query.searchTerm; // Obtenemos el area a buscar desde la consulta
  try {
  
    const items = await controlador.ctl_consulta_ResponsablePorUnidad(id_unidad,searchTerm);
    respuesta.success(req, res, items, 200);
    // Llamamos al método todos del controlador
  } catch (err) {
    next(err);
  }
});
router.get("/consulta_Por_ResponsableGlobalPorUnidad", async function (req, res,next) {
  
   const id_unidad = req.query.id_unidad; // Obtenemos ID unidad desde la consulta
  const searchTerm = req.query.searchTerm; // Obtenemos el area a buscar desde la consulta
  try {
  
    const items = await controlador.ctl_consulta_Por_ResponsableGlobalPorUnidad(id_unidad,searchTerm);
    respuesta.success(req, res, items, 200);
    // Llamamos al método todos del controlador
  } catch (err) {
    next(err);
  }
});



// Ruta para obtener todos los items
router.get("/ConsultaTodosResponsablePorIDUnidad", async function (req, res,next) {
  
   const id_unidad = req.query.id_unidad; // Obtenemos id unidad desde la consulta


  try {
    const items = await controlador.ctl_ConsultaTodosResponsablePorIDUnidad(id_unidad);
    respuesta.success(req, res, items, 200);
    // Llamamos al método todos del controlador
  } catch (err) {
    next(err);
  }
});
router.get("/consultaResponsablesGlobalPorUnidad", async function (req, res,next) {
  
   const id_unidad = req.query.id_unidad; // Obtenemos ID unidad desde la consulta
  try {
  
    const items = await controlador.ctl_consultaResponsablesGlobalPorUnidad(id_unidad);
    respuesta.success(req, res, items, 200);
    // Llamamos al método todos del controlador
  } catch (err) {
    next(err);
  }
});

router.get("/ConsultaResponsablePorIdResponsable", async function (req, res,next) {
  
   const id_responsable = req.query.id_responsable; // Obtenemos ID responsable desde la consulta

  try {
  
    const items = await controlador.ctl_consulta_ResponsablePorIdResponsable(id_responsable);
    respuesta.success(req, res, items, 200);
    // Llamamos al método todos del controlador
  } catch (err) {
    next(err);
  }
});
/****************************************************************************************************** */
//Insert
/****************************************************************************************************** */
//*POST RESPONSABLES
router.post("/AgregarResponsable", async function (req, res, next) {
  const responsableData = req.body; // Asegúrate de que estás enviando el cuerpo correctamente
  try {

    const response = await controlador.ctl_agregar_responsable(responsableData);
    return res.status(201).json(response); // 201 para creación exitosa
  } catch (err) {
    next(err);
  }
});


/****************************************************************************************************** */
//UPDATE
/****************************************************************************************************** */
router.put("/EditarResponsablePorIDConPassword/:id_responsable", async function (req, res, next) {
   const id_responsable = parseInt(req.params.id_responsable, 10);
   const dataResponsable = req.body;
 
  console.log("ID RESPONSABLE A EDITAR:", id_responsable);
  console.log("RESPONSABLE data:", dataResponsable);

  try {
    const result = await controlador.ctl_EditarResponsablePorIDConPassword(id_responsable, dataResponsable);
    respuesta.success(req, res, result, 200); // 200 para actualización exitosa
  } catch (err) {
    next(err);
  }
});

router.put("/EditarResponsablePorIDSinPassword/:id_responsable", async function (req, res, next) {
 const id_responsable = parseInt(req.params.id_responsable, 10);
   const dataResponsable = req.body;

  console.log("ID RESPONSABLE A EDITAR:", id_responsable);
  console.log("DATA RESPONSABLE A EDITAR:", dataResponsable);
  try {
    const result = await controlador.ctl_EditarResponsablePorIDSinPassword(id_responsable, dataResponsable);
    respuesta.success(req, res, result, 200); // 200 para actualización exitosa
  } catch (err) {
    next(err);
  }
});

module.exports = router;
