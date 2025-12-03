require('dotenv').config()
const NodeCache = require('node-cache');
module.exports = {
    app: {
        port: process.env.PORT || 4000,
    },
    mysql: {
        host: process.env.HOST || 'localhost',
        user: process.env.USER || 'root',
        password: process.env.PASSWORD || 'root',
        database: process.env.DBNAME || 'db'
    },

    my_cache: new NodeCache({
        stdTTL: 300,  // Tiempo de vida por defecto en segundos
        checkperiod: 60  // Intervalo de revisión en segundos
    }),
    cacheKey: 'cacheConsRetTransito',
    salt_rounds: process.env.SALT_ROUNDS || 20,
    secret_jwt_key: process.env.SECRET_JWT_KEY,
    secure_cookie: process.env.SECURE_COOKIE === 'true',
    domain: process.env.DOMAIN || 'localhost'
};


//const cacheKey = 'cacheConsRetTransito';