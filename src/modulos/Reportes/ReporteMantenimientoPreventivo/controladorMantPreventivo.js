const db= require('../../../DB/conexion');

const TABLA= 'reporte_preventivo';


async function ctl_consulta_Conteo_MantenimientoPreventivo(){

         return db.consulta_Conteo_MantenimientoPreventivo(TABLA);

}






module.exports = {
    ctl_consulta_Conteo_MantenimientoPreventivo,
    
    
}