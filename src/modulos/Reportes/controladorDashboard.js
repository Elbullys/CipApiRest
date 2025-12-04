const db= require('../../DB/conexion');

const TABLA= 'reporte_retiro_equipo';
//consulta_ALL_dispositivos


async function ctl_consultaRetirosEnTransito(){
     //return db.consulta_NumSerie_CodigoTI(TABLA, IdUnidad); 

     
     
           return db.consulta_TotalRetirosEnTransito(TABLA);
      
    
     
     
}

module.exports = {
    ctl_consultaRetirosEnTransito
    
}