const express = require("express");
const respuesta = require("../../red/respuestas"); // Importamos el archivo de respuestas
const router = express.Router();
const controlador = require("./controladorLoginTecnicos"); // Importamos el controlador
const jwt = require("jsonwebtoken");
const config = require("../../config");
const { requireAuth } = require('../../middleware/authMiddleware');






//LOGIN
router.post("/logintecnico" ,async function (req, res, next) {


  try {
    const Data = req.body;


    //const username=usuarioData.Username;
    //const  Password=usuarioData.Passwordsave;


    const items = await controlador.ctl_login_tecnico(Data);
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
    const token = jwt.sign(payload, config.secret_jwt_key, { expiresIn: '1h' })
    res.
      cookie('access_token', token, {
        httpOnly: false, // El token no será accesible desde JavaScript del lado del cliente
        secure: process.env.NODE_ENV === 'production',  // true en producción (HTTPS)
        sameSite: "Lax",//Strict // Asegura que la cookie solo se envíe en solicitudes del mismo sitio
        maxAge: 1000 * 60 * 60, // 1 hora en milisegundos
        domain:'https://apirestcip.onrender.com'// config.domain ||, // Ajusta el dominio según sea necesario
      })

    res.send({
      success: true,
      data: {
        error: false,
        message: items.message || 'Login exitoso',
        token: token
        /*username: items.usuario,
        Idusuario: items.id_tecnico, 
        IsAdmin:items.IsAdmin*/
      },
    });


    /*respuesta.success(req, res, {username,token,mensajes}, 200);*/

  } catch (error) {
    next(error);
  }

});

router.get('/protected',requireAuth ,(req, res) => {

  res.json({
    success: true,
    message: 'Acceso concedido al recurso protegido.',
    data: req.userSessionData  // Devuelve los datos del usuario
  });
});


module.exports = router;