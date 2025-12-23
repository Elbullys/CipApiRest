const db= require('../../../DB/conexion');

const TABLA= 'reporte_correctivo';


async function ctl_consulta_Conteo_MantenimientoCorrectivo(){

         return db.consulta_Conteo_MantenimientoCorrectivo(TABLA);

}






module.exports = {
    ctl_consulta_Conteo_MantenimientoCorrectivo,
    
    
}