const express = require("express");
const respuesta = require("../../red/respuestas"); // Importamos el archivo de respuestas
const router = express.Router();
const controlador = require("./controladorTecnicos"); // Importamos el controlador
const jwt = require("jsonwebtoken");


/****************************************************************************************************** */
//CONSULTS
/****************************************************************************************************** */
//*GET
router.get("/consultatecnicos", async function (req, res, next) {


  const searchTerm = req.query.searchTerm; // Obtenemos el area a buscar desde la consulta
  console.log("searchTerm", searchTerm);
  try {

    const items = await controlador.ctl_Consulta_Todos_Tecnicos(searchTerm);
    respuesta.success(req, res, items, 200);
    // Llamamos al método todos del controlador
  } catch (err) {
    next(err);
  }
});
router.get("/consultatecnicosActivos", async function (req, res, next) {


  const searchTerm = req.query.searchTerm; // Obtenemos el area a buscar desde la consulta
  
  try {

    const items = await controlador.ctl_Consulta_Todos_Tecnicos_Activos(searchTerm);
    respuesta.success(req, res, items, 200);
    // Llamamos al método todos del controlador
  } catch (err) {
    next(err);
  }
});
router.get("/consultarportecnico", async function (req, res, next) {


  const id_tecnico = req.query.id_tecnico; // Obtenemos el area a buscar desde la consulta

  try {

    const items = await controlador.ctl_Consulta_Por_Tecnico(id_tecnico);
    respuesta.success(req, res, items, 200);
    // Llamamos al método todos del controlador
  } catch (err) {
    next(err);
  }
});

/****************************************************************************************************** */
//Insert
/****************************************************************************************************** */
//*POST TECNICOS
router.post("/AgregarTecnico", async function (req, res, next) {
  const tecnicoData = req.body; // Asegúrate de que estás enviando el cuerpo correctamente
  try {

    const response = await controlador.ctl_agregar_tecnico(tecnicoData);

    return res.status(201).json(response); // 201 para creación exitosa
  } catch (err) {
    next(err);
  }
});

/****************************************************************************************************** */
//UPDATE
/****************************************************************************************************** */
router.put("/EditartecnicoPorIDConPassword/:id_tecnico", async function (req, res, next) {
   const id_tecnico = parseInt(req.params.id_tecnico, 10);
   const dataTecnico = req.body;
 
  console.log("ID TECNICO A EDITAR:", id_tecnico);
  console.log("TECNICO data:", dataTecnico);

  try {
    const result = await controlador.ctl_EditartecnicoPorIDConPassword(id_tecnico, dataTecnico);
    respuesta.success(req, res, result, 200); // 200 para actualización exitosa
  } catch (err) {
    next(err);
  }
});

router.put("/EditartecnicoPorIDSinPassword/:id_tecnico", async function (req, res, next) {
 const id_tecnico = parseInt(req.params.id_tecnico, 10);
   const dataTecnico = req.body;

  console.log("ID TECNICO A EDITAR:", id_tecnico);
  console.log("DATA TECNICO A EDITAR:", dataTecnico);
  try {
    const result = await controlador.ctl_EditartecnicoPorIDSinPassword(id_tecnico, dataTecnico);
    respuesta.success(req, res, result, 200); // 200 para actualización exitosa
  } catch (err) {
    next(err);
  }
});




module.exports = router;