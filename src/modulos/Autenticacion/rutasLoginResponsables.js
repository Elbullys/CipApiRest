const express = require("express");
const respuesta = require("../../red/respuestas"); // Importamos el archivo de respuestas
const router = express.Router();
const controlador = require("./controladorLoginResponsables"); // Importamos el controlador
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
const config = require("../../config");





//LOGIN
router.post("/loginresponsable", async function (req, res, next) {

  try {
    const { username, Password } = req.body;  // Valida que vengan del body

    //const username=usuarioData.Username;
    //const  Password=usuarioData.Passwordsave;
    

      const items = await controlador.ctl_login_tecnico(username, Password);
      if (!items || !items.usuario) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      // Crea el payload del JWT (solo datos no sensibles)
    const payload = {
      usuario: items.usuario,
      id_tecnico: items.id_tecnico,
      IsAdmin: items.IsAdmin
    };

      //CREACION del token JWT AUTETICACION 
       const token = jwt.sign(payload, config.secret_jwt_key, { expiresIn: '1h' });
      res.
        cookie("access_token", token, {
          httpOnly: true, // El token no será accesible desde JavaScript del lado del cliente
          secure: process.env.NODE_ENV === 'production',  // true en producción (HTTPS)
          sameSite: "Strict", // Asegura que la cookie solo se envíe en solicitudes del mismo sitio
          maxAge: 1000 * 60 * 60, // 1 hora en milisegundos
        });
        
        res.status(200).json({
      usuario: items.usuario,
      id_tecnico: items.id_tecnico,
      IsAdmin: items.IsAdmin,
      message: items.message || 'Login exitoso'
    });

      
      /*respuesta.success(req, res, {username,token,mensajes}, 200);*/
     
  } catch (error) {
    next(error);
  }

});

router.get("/Protected", async function (req, res, next) {
  try {
    // const items = await controlador.ctl_consulta_lavadores();
    respuesta.success(req, res, items, 200);
    // Llamamos al método todos del controlador
  } catch (err) {
    next(err);
  }
});



module.exports = router;