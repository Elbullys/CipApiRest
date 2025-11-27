const jwt = require('jsonwebtoken');
const config = require('../config');

// Middleware 1: Carga los datos del usuario decodificando el JWT de la cookie
const loadUserData = (req, res, next) => {
    
    // 1. Excluye rutas públicas (ej. el login)
    // Usamos includes para ser flexibles con la ruta completa.
    if (req.path.includes('/LoginTecnico')) {
        
        return next();
    }

    // 2. Intentar cargar el usuario desde la cookie JWT
    const token = req.cookies.access_token;
    if (token) {
        try {
           
            // Decodificar el token usando la clave secreta
            const decodedPayload = jwt.verify(token, config.secret_jwt_key);
            
            // Adjuntar los datos decodificados a la solicitud para uso posterior
            req.userSessionData = {
                usuario: decodedPayload.usuario,
                id_tecnico: decodedPayload.id_tecnico,
                IsAdmin: decodedPayload.IsAdmin
            };


        } catch (err) {
            // Si el token es inválido (expirado, mal formato, etc.), la solicitud
            // continúa sin req.userSessionData. El middleware 'checkAuth' manejará el 401.
            console.error("Error al verificar JWT:", err.message);
            // Opcional: limpiar la cookie inválida si el error es de expiración
            // res.clearCookie('access_token'); 
        }
    }

    // Continúa con la solicitud. req.userSessionData será undefined si no hay token o es inválido.
    next();
};

// Middleware 2: Verifica que los datos del usuario se hayan cargado (Autorización)
const checkAuth = (req, res, next) => {
    if (!req.userSessionData) {
        return res.status(401).send({ error: "No autorizado. Token inválido o no proporcionado." });
    }
    next();
};

// Middleware 3: Opcional, pero útil para cargar los datos en variables directas de req
function requireAuth(req, res, next) {
    const data = req.userSessionData;

    if (data && data.usuario) {
        req.username = data.usuario;
        req.id_tecnico = data.id_tecnico;
        return next();  // Usuario autenticado, continúa
    } else {
        // En este punto, si no hay datos, es porque 'loadUserData' no encontró un token válido.
        return res.status(401).json({
            error: 'Sesión expirada o inválida',
            message: 'Vuelve a loguearte'
        });
    }
}

module.exports = { loadUserData, requireAuth, checkAuth };