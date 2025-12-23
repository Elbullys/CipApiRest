const db = require('../../DB/conexion');
const bcrypt = require("bcrypt");
const TABLA = 'movimientos_componentes';
const config = require("../../config");
const Utils = require("../Utils"); // Importamos el archivo de respuestas

async function ctl_AgregarMovimientoComponente(componenteMovAnterior,componenteMovFinal,idtecnico) {
    /*
    const validarusername = Utils.Validar_datos.username(tecnicoData.usuario);
    const validarpassword = Utils.Validar_datos.password(tecnicoData.PasswordWeb);
    const validarnombre = Utils.Validar_datos.validar_Campos_String(tecnicoData.nombre, "El nombre");
    const validarcargo = Utils.Validar_datos.validar_Campos_Select(tecnicoData.cargo, "un cargo");
    const validarestatus_tecnico = Utils.Validar_datos.validar_Campos_Select(tecnicoData.estatus_tecnico, "un estatus de técnico");
    const varAdmin = tecnicoData.IsAdmin === "SI" ? 1 : 0;
    const validarestatus_isAdmin = Utils.Validar_datos.validar_Campos_Numeric(varAdmin, "El estatus de administrador");
    //Validar_datos.username(tecnicoData.usuario);

    if (validarusername.error || validarpassword.error || validarnombre.error || validarcargo.error
        || validarestatus_tecnico.error || validarestatus_isAdmin.error
    ) {
        // Array de todas las validaciones para iterar
        const validations = [validarusername, validarpassword, validarnombre, validarcargo, validarestatus_tecnico, validarestatus_isAdmin];

        // Encontrar la primera validación que falló
        const failedValidation = validations.find(val => val.error);

        return {
            icon: failedValidation.icon || "warning",
            error: true,
            message: failedValidation.message || "Campo no válido",
        };
    }*/
    
       
     
       
       const nuevotecnico = await db.agregarMovmientoComponente(TABLA, componenteMovAnterior, componenteMovFinal, idtecnico);
       return { error: false, body: nuevotecnico };
   

    

}
async function ctl_consulta_Conteo_MovimientosPorDia(){

         return db.consulta_Conteo_MovimientosPorDia(TABLA);

}

async function ctl_AgregarMovimientoColectivoComponenteArray(datosExcel, componentesBD) {
    try {
        // Validaciones de seguridad
        /*if (!Array.isArray(datosExcel) || datosExcel.length === 0) {
            return { error: true, message: "No hay datos para procesar." };
        }*/

        console.log("componentesBD",componentesBD);
       
        console.log("datosExcel",datosExcel);
        const result = await db.AgregarMovimientoColectivoComponenteArray(
            TABLA, // tu tabla de historial
            "componentes",             // tu tabla de inventario actual
            datosExcel, 
            componentesBD   
        );

        return result;
    } catch (error) {
        return { icon: "error", error: true, message: "Error en la transacción: " + error.message };
    }
}





module.exports = {
    //INSERT
    ctl_AgregarMovimientoComponente,
    ctl_AgregarMovimientoColectivoComponenteArray,
    //CONSULTAR
    ctl_consulta_Conteo_MovimientosPorDia,

}