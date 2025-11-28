const jwt = require('jsonwebtoken');
const config = require('../config');

// Middleware 1: Carga los datos del usuario decodificando el JWT
const loadUserData = (req, res, next) => {
    // 1. Excluir rutas de login para no interferir
    if (req.path.includes('/logintecnico') || req.path.includes('/LoginTecnico')) {
        return next();
    }
req.userSessionData = null;
    // DEBUG: Muestra si el header de autorización llega
    console.log("Headers Authorization recibidos:", req.headers.authorization); 

    // A. Intentar obtener el token de las cookies
   let token = req.cookies.access_token; 

    // B. Si no hay cookie, intentar obtenerlo del header Authorization (RESPALDO)
    if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);  
        }
    }

    console.log("Token recibido:", token ? "Presente" : "Ausente");

    if (token) {
        try {
            // Verifica el token usando la clave secreta
            const decodedPayload = jwt.verify(token, process.env.SECRET_JWT_KEY);
            
            // Si es válido, asigna los datos al objeto de la solicitud
            req.userSessionData = {
                usuario: decodedPayload.usuario,
                id_tecnico: decodedPayload.id_tecnico,
                IsAdmin: decodedPayload.IsAdmin
            };
            console.log("Datos decodificados:", req.userSessionData);
        } catch (err) {
            // *** MANEJO DE ERROR CRÍTICO ***
            // Si la verificación falla (expirado, firma incorrecta, etc.)
            console.error("Error al verificar JWT:", err.name, "-", err.message);
            // Aseguramos que los datos sean nulos/vacíos para que requireAuth falle
            req.userSessionData = null; 
        }
    } else {
        // Si no hay token ni en cookie ni en header
        console.log("No hay token en cookies ni headers");
        req.userSessionData = null; 
    }
    
    // Siempre llama a next() para pasar al siguiente middleware (requireAuth o el controlador)
    next();
};

// Middleware 2: Verifica que los datos del usuario se hayan cargado (Autorización)
// NOTA: Este middleware checkAuth es redundante si usas requireAuth.
// Lo mantengo por si tienes lógica que lo necesita, pero requireAuth es más completo.
const checkAuth = (req, res, next) => {
    if (!req.userSessionData) {
        return res.status(401).send({ error: "No autorizado. Token inválido o no proporcionado." });
    }
    next();
};
// Middleware 3: Requerir autenticación 
function requireAuth(req, res, next) {
    const data = req.userSessionData;
    
    // DEBUG: Muestra los datos que se cargaron
    console.log("requireAuth: Datos de Sesión:", data);

    if (data && data.usuario) {
        // El token fue válido. El usuario está autenticado.
        // Opcional: Cargar variables directas
        req.username = data.usuario;
        req.id_tecnico = data.id_tecnico;
        return next();  
    } else {
        // El token fue inválido (falló loadUserData) o no existía.
        return res.status(401).json({
            error: 'Sesión expirada o inválida',
            message: 'Vuelve a loguearte por favor'
        });
    }
}

module.exports = { loadUserData, requireAuth, checkAuth };