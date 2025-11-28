const jwt = require('jsonwebtoken');
const config = require('../config');

// Middleware 1: Carga los datos del usuario decodificando el JWT
const loadUserData = (req, res, next) => {
    // Excluir rutas de login
    if (req.path.includes('/logintecnico') || req.path.includes('/LoginTecnico')) {
        return next();
    }

    // 1. Intentar obtener el token de las cookies
    let token = req.cookies.access_token;  

    // 2. Si no hay cookie, intentar obtenerlo del header Authorization
    if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);  // Extrae el token (después de "Bearer ")
        }
    }

    console.log("Token recibido:", token ? "Presente" : "Ausente");

    if (token) {
        try {
            // Verifica el token
            const decodedPayload = jwt.verify(token, config.secret_jwt_key);
            
            // Si es válido, carga los datos
            req.userSessionData = {
                usuario: decodedPayload.usuario,
                id_tecnico: decodedPayload.id_tecnico,
                IsAdmin: decodedPayload.IsAdmin
            };
            console.log("Datos decodificados:", req.userSessionData);
        } catch (err) {
            // Si la verificación falla (expirado, firma incorrecta, etc.)
            console.error("Error al verificar JWT:", err.name, "-", err.message);
            // *** CAMBIO CLAVE: Aseguramos que los datos sean nulos/vacíos ***
            req.userSessionData = null; 
        }
    } else {
        console.log("No hay token en cookies ni headers");
        req.userSessionData = null; // También asegurar nulo si no hay token
    }
    
    // Siempre llama a next() para que el siguiente middleware maneje la autorización
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

// Middleware 3: Requerir autenticación (Maneja el 401 que estabas viendo)
function requireAuth(req, res, next) {
    const data = req.userSessionData;

    if (data && data.usuario) {
        // Usuario autenticado, se cargan las variables si es necesario
        req.username = data.usuario;
        req.id_tecnico = data.id_tecnico;
        return next();  
    } else {
        // No hay datos de sesión válidos
        return res.status(401).json({
            error: 'Sesión expirada o inválida',
            message: 'Vuelve a loguearte'
        });
    }
}

module.exports = { loadUserData, requireAuth, checkAuth };