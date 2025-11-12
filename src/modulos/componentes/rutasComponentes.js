const express = require("express");
const respuesta = require("../../red/respuestas"); // Importamos el archivo de respuestas

const router = express.Router();

const controlador = require("./controladorComponentes"); // Importamos el controlador
/****************************************************************************************************** */
//CONSULTAS
/****************************************************************************************************** */
// Ruta para obtener todos los items
router.get("/ConsultaComponentes", async function (req, res,next) {
  try {
    const items = await controlador.consulta_componente();
    respuesta.success(req, res, items, 200);
    // Llamamos al método todos del controlador
  } catch (err) {
    next(err);
  }
});
// Ruta para obtener un item por su id
router.post("/VerificarExistenciaComponente", async function (req, res,next) {
  //const databusqueda =req.body.codigoTI; 
  const databusqueda =req.query.dataBusqueda; // Obtenemos el código TI desde la consulta
  try {
    const items = await controlador.ctl_verificar_id_componente_QR_Num_Serie(databusqueda);
console.log("items",items);
    respuesta.success(req, res, items, 200);

  } catch (err) {
    next(err);
  }
});
//RUTA PARA REALIZAR BUSQUEDA POR CODIGO TI O NUMERO DE SERIE
router.post("/BusquedaComponenteCodigoTINumSerie", async function (req, res,next) {
  //const databusqueda =req.body.codigoTI; 
  const databusqueda =req.query.dataBusqueda; // Obtenemos el código TI desde la consulta

  try {
    const items = await controlador.ctl_consulta_CodigoTI_Num_Serie(databusqueda);
    respuesta.success(req, res, items, 200);
  } catch (err) {
    next(err);
  }
});

//RUTA PARA CONSULTAR POR CODIGO TI O NUMERO SERIE
router.get("/ConsultarCodigoTINumSerie/:databusqueda", async function (req, res,next) {
  try {
    const databusqueda =req.params.databusqueda; // Obtenemos el código TI desde la consulta
    const items = await controlador.ctl_consulta_CodigoTI_Num_Serie(databusqueda);

    respuesta.success(req, res, items, 200);
    // Llamamos al método todos del controlador
  } catch (err) {
    next(err);
  }
});

//RUTA PARA CONSULTAR POR ID COMPONENTE
router.get("/ConsultarIdComponente/:idcomponente", async function (req, res,next) {
  try {
    const id_componente =req.params.idcomponente; // Obtenemos el código TI desde la consulta
    const items = await controlador.ctl_consulta_Id_Componente(id_componente);
    respuesta.success(req, res, items, 200);
    // Llamamos al método todos del controlador
  } catch (err) {
    next(err);
  }
});

/****************************************************************************************************** */
//UPDATE
/****************************************************************************************************** */
router.put("/EditarComponenteFactura/:idComponente", async function (req, res, next) {
  const idComponente = parseInt(req.params.idComponente, 10);
  console.log("req.body completo:", req.body);
  const data = req.body;
  console.log("data recibida en ruta:", data);
  if (isNaN(idComponente)) {
    return res.status(400).json({ error: true, message: "ID inválido" });
  }
  try {
    const result = await controlador.ctl_Editar_ComponenteFactura(idComponente, data);
    respuesta.success(req, res, result, 200); // 200 para actualización exitosa
  } catch (err) {
    next(err);
  }
});
module.exports = router;
