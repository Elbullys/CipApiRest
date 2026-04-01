const db= require('../../DB/conexion');

const TABLA= 'Cat_disco_duro';
//consulta_ALL_dispositivos
/*
async function ctl_consulta_TODOS_dispositivos(){

           return db.consulta_TODOS_dispositivos(TABLA);

}*/

async function ctl_consulta_Todos_DiscoDuro_busqueda(searchTerm){



     
           return db.consulta_Todos_DiscoDuro_busqueda(TABLA,searchTerm);
      
    
     
     
}

module.exports = {
    ctl_consulta_Todos_DiscoDuro_busqueda

    
}