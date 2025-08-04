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
    }
}