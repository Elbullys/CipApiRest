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
if(items)
  {
    req.session.componenteMovAnterior = items;
    
  }    
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
  const data = req.body;
 
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

  router.put("/EditarComponentePorID/:idComponente", async function (req, res, next) {
    const idComponente = parseInt(req.params.idComponente, 10);
    
    // Validación del ID: Asegúrate de que sea un entero positivo
    if (isNaN(idComponente) || idComponente <= 0 || !Number.isInteger(idComponente)) {
      return res.status(400).json({ error: true, message: "ID de componente inválido" });
    }
    
    const {data,data_componentes_anteriores } = req.body;
  

    try {
      // Validar que existan
  if (!data || !data_componentes_anteriores) {
    return res.status(400).json({icon:"warning", error: true, message: "Datos incompletos " });
  }
      
      const result = await controlador.ctl_Editar_ComponentePorID(idComponente, data,data_componentes_anteriores);

      respuesta.success(req, res, result, 200);
    } catch (err) {
      next(err);
    }
  });
  

//ctl_Editar_ComponentePorID
module.exports = router;
