const express = require("express");
const respuesta = require("../../red/respuestas"); // Importamos el archivo de respuestas

const router = express.Router();

const controlador = require("./controladorFacturas"); // Importamos el controlador

/****************************************************************************************************** */
//CONSULTAR
/****************************************************************************************************** */
// Ruta para obtener todos los items
router.get("/ConsultaFacturaBusqueda", async function (req, res,next) {
  const searchTerm = req.query.searchTerm; // Obtenemos el area a buscar desde la consulta
  try {
  
    const items = await controlador.ctl_consulta_Factura_Busqueda(searchTerm);
    respuesta.success(req, res, items, 200);
    // Llamamos al método todos del controlador
  } catch (err) {
    next(err);
  }
});

// Ruta para obtener todos los items
router.get("/ConsultaTodasFacturas", async function (req, res,next) {
  try {
    const items = await controlador.ctl_consulta_Todas_Facturas();
    respuesta.success(req, res, items, 200);
    // Llamamos al método todos del controlador
  } catch (err) {
    next(err);
  }
});

/****************************************************************************************************** */
//INSERT
/****************************************************************************************************** */
router.post("/AgregarNuevaFactura", async function (req, res, next) {
  try {
    const Data = req.body; // Asegúrate de que estás enviando el cuerpo correctamente
    const items = await controlador.ctl_agregarFactura(Data);
   
    // Validación: Asegúrate de que items tenga un ID
    if (!items || !items.insertId) {
      return res.status(500).json({ error: true, message: "Error al crear la factura: ID no generado" });
    }
    
   
    respuesta.success(req, res, { id: items.insertId }, 201); // Incluye el ID y el resto de items
  } catch (err) {
    next(err);
  }
});
module.exports = router;