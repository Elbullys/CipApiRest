const db= require('../../DB/conexion');

const TABLA= 'marca';
//consulta_ALL_dispositivos
/*
async function ctl_consulta_TODOS_dispositivos(){

           return db.consulta_TODOS_dispositivos(TABLA);

}*/

async function ctl_consulta_Por_MarcaModelo_BusquedaPorDispositivo(searchTerm,FK_dispositivo){
     //return db.consulta_NumSerie_CodigoTI(TABLA, IdUnidad); 


     
           return db.consulta_Por_MarcaModelo_BusquedaPorDispositivo(TABLA,searchTerm,FK_dispositivo);
      
    
     
     
}

module.exports = {
    ctl_consulta_Por_MarcaModelo_BusquedaPorDispositivo

    
}