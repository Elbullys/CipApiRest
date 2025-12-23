const express = require("express");
const respuesta = require("../../red/respuestas"); // Importamos el archivo de respuestas
const router = express.Router();
const controlador = require("./controladorLoginTecnicos"); // Importamos el controlador
const jwt = require("jsonwebtoken");
const config = require("../../config");
const {loadUserData,requireAuth } = require('../../middleware/authMiddleware');
const namecache=require("../Utils");

//LOGIN
router.post("/logintecnico", async function (req, res, next) {
  try {
    const Data = req.body;
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
    const token = jwt.sign(payload, process.env.SECRET_JWT_KEY, { expiresIn: '1h' })
    res.
      cookie('access_token', token, {
        httpOnly: process.env.SECURE_COOKIE, // El token no será accesible desde JavaScript del lado del cliente
        secure:  process.env.NODE_ENV,  // true en producción (HTTPS)
        sameSite: "None",//Strict // Asegura que la cookie solo se envíe en solicitudes del mismo sitio
        maxAge: 1000 * 60 * 60 // 1 hora en milisegundos
        //domain:'apirestcip.onrender.com',// config.domain ||, // Ajusta el dominio según sea necesario
      })

    res.send({
    success: true,
    data: {
        error: false,
        message: items.message || 'Login exitoso',
        icon:"success",
        // Opcional: Ya no es necesario enviar el token en el cuerpo
        // token: token 
    },
    });


    /*respuesta.success(req, res, {username,token,mensajes}, 200);*/

  } catch (error) {
    next(error);
  }

});

// RUTA PROTEGIDA (usa requireAuth para validar el token)
router.get('/protected',loadUserData, requireAuth, (req, res) => {
  res.json({
    success: true,
    message: 'Acceso concedido al recurso protegido.',
    data: req.userSessionData,
    username: req.username, 
    id_tecnico: req.id_tecnico,// Aquí ya están los datos validados
  });
});



router.post("/logouttecnico", function (req, res, next) {
    try {
        const isProduction = process.env.NODE_ENV === 'production';
        
        const cookieBaseOptions = {
           httpOnly: process.env.SECURE_COOKIE, // El token no será accesible desde JavaScript del lado del cliente
        secure:  process.env.NODE_ENV,  
            sameSite: "None"
            // Debe coincidir con el login
            // Si usaste domain: 'apirestcip.onrender.com' en login, descoméntalo aquí.
        };

        // Opción A: Usar res.cookie con expires: new Date(0) (Más explícito)
        

        // Opción B: Usar res.clearCookie con las mismas opciones
         res.clearCookie('access_token', cookieBaseOptions); 
        
        res.json({
            success: true,
            message: 'Sesión cerrada exitosamente.'
        });

    } catch (error) {
        // Usa next(error) para el manejo de errores centralizado
        next(error); 
    }

    //ELIMINACION CACHE NODE
    config.my_cache.del(config.cacheKey);
    console.log(`La clave de caché '${config.cacheKey}' fue eliminada del servidor.`);
});


router.get('/ConsultaDatos', requireAuth, (req, res) => {
    // Si la ejecución llega hasta aquí, ¡el usuario está autenticado!
    
    // requireAuth debe haber adjuntado los datos necesarios al objeto 'req'
    const datosTecnico = {
        usuario: req.username,          // Obtenido del middleware requireAuth
        id_tecnico: req.id_tecnico,     // Obtenido del middleware requireAuth
        sessionData: req.userSessionData // Objeto completo de la sesión
    };

    // Envía la respuesta JSON con los datos del usuario.
    res.json({
        success: true,
        message: 'Datos de sesión consultados exitosamente.',
        data: datosTecnico
    });
});

module.exports = router;