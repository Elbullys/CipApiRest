const express = require("express");
const respuesta = require("../../red/respuestas"); // Importamos el archivo de respuestas
const router = express.Router();
const controlador = require("./controladorTecnicos"); // Importamos el controlador
const jwt= require("jsonwebtoken");


//GET TECNICOS
router.post("/AgregarTecnico", async function (req, res,next) {
    const tecnicoData = req.body; // Asegúrate de que estás enviando el cuerpo correctamente
  try {

   const response = await controlador.ctl_agregar_tecnico(tecnicoData);
        if (response.error) {
            return res.status(409).json(response); // Devuelve un error 400 si el usuario está duplicado
        }
        return res.status(201).json(response); // 201 para creación exitosa
  } catch (err) {
    next(err);
  }  
});




module.exports = router;