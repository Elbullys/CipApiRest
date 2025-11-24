const express = require("express");
const respuesta = require("../../red/respuestas"); // Importamos el archivo de respuestas
const router = express.Router();
const controlador = require("./controladorLoginTecnicos"); // Importamos el controlador
const jwt = require("jsonwebtoken");
const config = require("../../config");






//LOGIN
router.post("/logintecnico", async function (req, res, next) {

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
        httpOnly: true, // El token no será accesible desde JavaScript del lado del cliente
        secure: process.env.NODE_ENV === 'production',  // true en producción (HTTPS)
        sameSite: "Strict",//Strict // Asegura que la cookie solo se envíe en solicitudes del mismo sitio
        maxAge: 1000 * 60 * 60, // 1 hora en milisegundos // Ajusta el dominio según sea necesario
      })

    res.send({
      success: true,
      data: {
        error: false,
        message: items.message || 'Login exitoso',
        username: items.usuario,
        Idusuario: items.id_tecnico, 
        IsAdmin:items.IsAdmin
      }
    });


    /*respuesta.success(req, res, {username,token,mensajes}, 200);*/

  } catch (error) {
    next(error);
  }

});

router.get('/protected', (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    console.log("no token");
    return res.status(401).json({ error: 'Access not authorized' });
  }
  try {
    const data = jwt.verify(token, config.secret_jwt_key);
   
    res.json({ message: 'Acceso concedido al recurso protegido.', data });//{ isAdmin, username , id_usuario}
  } catch (err) {
    res.status(400).json({ error: 'Token inválido.' });
  }
});


module.exports = router;