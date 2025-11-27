require('dotenv').config()
module.exports={
    app: {
        port:process.env.PORT|| 4000,
    },
    mysql:{
        host:process.env.HOST||'localhost',
        user:process.env.USER||'root', 
        password:process.env.PASSWORD||'root',
        database:process.env.DBNAME||'db'
    },
        salt_rounds: process.env.SALT_ROUNDS || 20,
        secret_jwt_key:process.env.SECRET_JWT_KEY,
        secure_cookie:process.env.SECURE_COOKIE === 'true',
        domain:process.env.DOMAIN||'localhost'
};