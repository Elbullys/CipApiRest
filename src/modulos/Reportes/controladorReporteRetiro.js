const db = require('../../DB/conexion');
//const Utils = require("../Utils"); // Importamos el archivo de respuestas

const TABLA= 'reporte_retiro_equipo';


async function ctl_consulta_TotalRetirosEnTransito(){
     //return db.consulta_NumSerie_CodigoTI(TABLA, IdUnidad); 

           return db.consulta_TotalRetirosEnTransito(TABLA);

}





module.exports = {
    ctl_consulta_TotalRetirosEnTransito,
    
    
}