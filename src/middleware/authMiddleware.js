const jwt = require('jsonwebtoken');
const config = require('../config');

// Middleware 1: Carga los datos del usuario decodificando el JWT de la cookie
const loadUserData = (req, res, next) => {
    if (req.path.includes('/logintecnico') || req.path.includes('/LoginTecnico')) {
        return next();
    }

    console.log("Cookies recibidas:", req.cookies);
    let token = req.cookies.access_token;  // Primero intenta cookies (para desarrollo)

    if (!token) {
        // Si no hay cookie, intenta headers (para producción cross-origin)
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);  // Extrae el token
        }
    }

    console.log("Token recibido:", token ? "Presente" : "Ausente");

    if (token) {
        try {
            const decodedPayload = jwt.verify(token, config.secret_jwt_key);
            req.userSessionData = {
                usuario: decodedPayload.usuario,
                id_tecnico: decodedPayload.id_tecnico,
                IsAdmin: decodedPayload.IsAdmin
            };
            console.log("Datos decodificados:", req.userSessionData);
        } catch (err) {
            console.error("Error al verificar JWT:", err.message);
        }
    } else {
        console.log("No hay token en cookies ni headers");
    }
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
console.log("data",data);
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