const jwt = require('jsonwebtoken');
const config = require('../config');

// Middleware 1: Carga los datos del usuario decodificando el JWT de la cookie
const loadUserData = (req, res, next) => {
    // Excluye rutas públicas
    if (req.path.includes('/logintecnico') || req.path.includes('/LoginTecnico')) {
        return next();
    }

    console.log("Cookies recibidas:", req.cookies);  // Agrega esto: Verifica si access_token llega
    const token = req.cookies.access_token;
    console.log("Token recibido:", token ? "Presente" : "Ausente");  // Agrega esto

    if (token) {
        try {
            const decodedPayload = jwt.verify(token, config.secret_jwt_key);
            req.userSessionData = {
                usuario: decodedPayload.usuario,
                id_tecnico: decodedPayload.id_tecnico,
                IsAdmin: decodedPayload.IsAdmin
            };
            console.log("Datos decodificados:", req.userSessionData);  // Agrega esto
        } catch (err) {
            console.error("Error al verificar JWT:", err.message);
        }
    } else {
        console.log("No hay token en cookies");  // Agrega esto
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