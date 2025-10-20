const db= require('../../DB/conexion');

const TABLA= 'unidad';

async function ctl_consulta_Por_unidad(databusqueda) {
    const resultado = await db.consulta_Por_Unidad(TABLA, databusqueda);
    
    if (Array.isArray(resultado) && resultado.length === 0) {  // No existe (array vacío)
        console.log("Unidad No Registrada");
      return { icon:"warning",error: true, message: "No se encuentra registrado"};  // Retorna respuesta de error
    } else {
        // Si existe, retorna el resultado de la consulta directamente
        return resultado;
    }
}



module.exports = {
    ctl_consulta_Por_unidad,
    
}