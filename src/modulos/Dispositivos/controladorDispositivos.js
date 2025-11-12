const db= require('../../DB/conexion');

const TABLA= 'dispositivos';
//consulta_ALL_dispositivos
async function ctl_consulta_TODOS_dispositivos(){

           return db.consulta_TODOS_dispositivos(TABLA);

}

async function ctl_consulta_Por_Dispositivo_Busqueda(searchTerm){
     //return db.consulta_NumSerie_CodigoTI(TABLA, IdUnidad); 

     
     
           return db.consulta_Por_Dispositivo_Busqueda(TABLA,searchTerm);
      
    
     
     
}

module.exports = {
    ctl_consulta_TODOS_dispositivos,
    ctl_consulta_Por_Dispositivo_Busqueda
    
}