const app = require('./src/app');

app.listen(app.get('port'), () => {
    console.log('Servidor a su servicio en el puerto ', app.get('port'));    
});