const db= require('../../DB/conexion');
const bcrypt = require("bcrypt");
const TABLA= 'responsable';
const Utils = require("../Utils"); // Importamos el archivo de respuestas
const config = require("../../config");



/****************************************************************************************************** */
//CONSULTS
/****************************************************************************************************** */


async function ctl_consulta_ResponsablePorUnidad(idUnidad,searchTerm){
     //return db.consulta_NumSerie_CodigoTI(TABLA, IdUnidad); 

     
     if(idUnidad==="" || idUnidad==null)
     {
        return { icon:"warning",error: true, message: "El campo no puede ir vacio"};  // Retorna respuesta de error
     }
     else
     {
           return db.consulta_ResponsablePorUnidad(TABLA, searchTerm,idUnidad);
      
    
     }
     
}
async function ctl_consulta_Por_ResponsableGlobalPorUnidad(idUnidad,searchTerm){
     //return db.consulta_NumSerie_CodigoTI(TABLA, IdUnidad); 

     
     if(idUnidad==="" || idUnidad==null)
     {
        return { icon:"warning",error: true, message: "El campo no puede ir vacio"};  // Retorna respuesta de error
     }
     else
     {
           return db.consulta_Por_ResponsableGlobalPorUnidad(TABLA, searchTerm,idUnidad);
      
    
     }
     
}


async function ctl_ConsultaTodosResponsablePorIDUnidad(id_unidad){
     //return db.consulta_NumSerie_CodigoTI(TABLA, IdUnidad); 

     if(id_unidad==="" || id_unidad==null)
     {
        return { icon:"warning",error: true, message: "El campo no puede ir vacio"};  // Retorna respuesta de error
     }
     else
     {
           return db.ConsultaTodosResponsablePorIDUnidad(TABLA, id_unidad);
      
    
     }
     
}
async function ctl_consultaResponsablesGlobalPorUnidad(idUnidad){
     //return db.consulta_NumSerie_CodigoTI(TABLA, IdUnidad); 

     
     if(idUnidad==="" || idUnidad==null)
     {
        return { icon:"warning",error: true, message: "El campo no puede ir vacio"};  // Retorna respuesta de error
     }
     else
     {
           return db.consulta_consultaResponsablesGlobalPorUnidad(TABLA,idUnidad);
      
    
     }
     
}

async function ctl_consulta_ResponsablePorIdResponsable(id_responsable){
     //return db.consulta_NumSerie_CodigoTI(TABLA, IdUnidad); 

     if(id_responsable==="" || id_responsable==null)
     {
        return { icon:"warning",error: true, message: "El campo no puede ir vacio"};  // Retorna respuesta de error
     }
     else
     {
           return db.consulta_ResponsablePorIdResponsable(TABLA, id_responsable);
      
    
     }
     
}

/****************************************************************************************************** */
//INSERT
/****************************************************************************************************** */
async function ctl_agregar_responsable(responsableData) {
    
    const validarusername = Utils.Validar_datos.username(responsableData.login);
    const validarpassword = Utils.Validar_datos.password(responsableData.password);
    const validarnombre = Utils.Validar_datos.validar_Campos_String(responsableData.nombre_responsable, "El nombre");
    const validarPasswordrepetir = Utils.Validar_datos.validar_Campos_String(responsableData.Passwordrepetir, "El nombre");
    const validarFK_idunidad = Utils.Validar_datos.validar_Campos_Numeric(parseInt(responsableData.FK_idunidad), "La unidad");
    const validarcargo = Utils.Validar_datos.validar_Campos_Select(responsableData.cargo, "un cargo");
    const validarestatus_responsable = Utils.Validar_datos.validar_Campos_Select(responsableData.estado_responsable, "un estatus de responsable");
    const validarFK_id_area = Utils.Validar_datos.validar_Campos_Numeric(parseInt(responsableData.FK_id_area), "un área");

    //Validar_datos.username(responsableData.usuario);

    if (validarusername.error || validarpassword.error || validarnombre.error || validarPasswordrepetir.error || validarFK_idunidad.error || validarcargo.error || validarestatus_responsable.error || validarFK_id_area.error
    ) {
        // Array de todas las validaciones para iterar
        const validations = [validarusername, validarpassword, validarnombre, validarPasswordrepetir, validarFK_idunidad, validarcargo, validarestatus_responsable, validarFK_id_area];
        // Encontrar la primera validación que falló
        const failedValidation = validations.find(val => val.error);

        return {
            icon: failedValidation.icon || "warning",
            error: true,
            message: failedValidation.message || "Campo no válido",
        };
    }
    else {
        
        const esDuplicado = await db.Verificar_Duplicidad_usuario_responsable(TABLA, responsableData.login, responsableData.FK_idunidad);
      
        if (esDuplicado) {
            return { icon: "warning", error: true, message: "Usuario Registrado", tittle: "Advertencia" }; // Enviar respuesta de error
        } else {
            
            // Usuario no existe, proceder a registrar
            const saltRounds = parseInt(config.salt_rounds);
            const passwordCIP = Utils.ConversionPasswords.ConversionContrasenaCIPDesktopEncriptar(responsableData.password);
            const encriptarpassword = responsableData.password;
            const hashedPassword = await bcrypt.hash(encriptarpassword, saltRounds);
            const nuevoresponsable = await db.agregarResponsable(TABLA, responsableData, hashedPassword, passwordCIP);
            return { icon: "success", error: false, message: "Agregado Correctamente", tittle: "¡Exito!", body: nuevoresponsable };
        }

    }

}

/****************************************************************************************************** */
//UPDATE
/****************************************************************************************************** */
async function ctl_EditarResponsablePorIDConPassword(id_responsable, responsableData) {


       const validarusername = Utils.Validar_datos.username(responsableData.login);
    const validarpassword = Utils.Validar_datos.password(responsableData.password);
    const validarnombre = Utils.Validar_datos.validar_Campos_String(responsableData.nombre_responsable, "El nombre");
    const validarPasswordrepetir = Utils.Validar_datos.validar_Campos_String(responsableData.Passwordrepetir, "El nombre");
    const validarFK_idunidad = Utils.Validar_datos.validar_Campos_String(responsableData.FK_idunidad, "La unidad");
    const validarcargo = Utils.Validar_datos.validar_Campos_Select(responsableData.cargo, "un cargo");
    const validarestatus_responsable = Utils.Validar_datos.validar_Campos_Select(responsableData.estado_responsable, "un estatus de responsable");
    const validarFK_id_area = Utils.Validar_datos.validar_Campos_Select(responsableData.FK_id_area, "un área");

    //Validar_datos.username(responsableData.usuario);

    if (validarusername.error || validarpassword.error || validarnombre.error || validarPasswordrepetir.error || validarFK_idunidad.error || validarcargo.error || validarestatus_responsable.error || validarFK_id_area.error
    ) {
        // Array de todas las validaciones para iterar
        const validations = [validarusername, validarpassword, validarnombre, validarPasswordrepetir, validarFK_idunidad, validarcargo, validarestatus_responsable, validarFK_id_area];
        // Encontrar la primera validación que falló
        const failedValidation = validations.find(val => val.error);

        return {
            icon: failedValidation.icon || "warning",
            error: true,
            message: failedValidation.message || "Campo no válido",
        };
    }
    
        // Usuario no existe, proceder a registrar
        const saltRounds = parseInt(config.salt_rounds);
        const passwordCIP = Utils.ConversionPasswords.ConversionContrasenaCIPDesktopEncriptar(responsableData.password);
        const encriptarpassword = responsableData.password;
        const hashedPassword = await bcrypt.hash(encriptarpassword, saltRounds);
        const responsable_actualizado = await db.EditarResponsablePorIDConPassword(TABLA, id_responsable, responsableData, hashedPassword, passwordCIP);
        return { icon: "success", error: false, message: "Se ha Editado Correctamente", tittle: "¡Exito!", body: responsable_actualizado };
    

}

async function ctl_EditarResponsablePorIDSinPassword(id_responsable, responsableData) {
      const validarusername = Utils.Validar_datos.username(responsableData.login);
    const validarpassword = Utils.Validar_datos.password(responsableData.password);
    const validarnombre = Utils.Validar_datos.validar_Campos_String(responsableData.nombre_responsable, "El nombre");
    const validarPasswordrepetir = Utils.Validar_datos.validar_Campos_String(responsableData.Passwordrepetir, "El nombre");
    const validarFK_idunidad = Utils.Validar_datos.validar_Campos_String(responsableData.FK_idunidad, "La unidad");
    const validarcargo = Utils.Validar_datos.validar_Campos_Select(responsableData.cargo, "un cargo");
    const validarestatus_responsable = Utils.Validar_datos.validar_Campos_Select(responsableData.estado_responsable, "un estatus de responsable");
    const validarFK_id_area = Utils.Validar_datos.validar_Campos_Select(responsableData.FK_id_area, "un área");

    //Validar_datos.username(responsableData.usuario);

    if (validarusername.error || validarpassword.error || validarnombre.error || validarPasswordrepetir.error || validarFK_idunidad.error || validarcargo.error || validarestatus_responsable.error || validarFK_id_area.error
    ) {
        // Array de todas las validaciones para iterar
        const validations = [validarusername, validarpassword, validarnombre, validarPasswordrepetir, validarFK_idunidad, validarcargo, validarestatus_responsable, validarFK_id_area];
        // Encontrar la primera validación que falló
        const failedValidation = validations.find(val => val.error);

        return {
            icon: failedValidation.icon || "warning",
            error: true,
            message: failedValidation.message || "Campo no válido",
        };
    }
    else {
        const responsable_actualizado = await db.EditarResponsablePorIDSinPassword(TABLA, id_responsable, responsableData);
        return { icon: "success", error: false, message: "Se ha Editado Correctamente", tittle: "¡Exito!", body: responsable_actualizado };
    }
}




module.exports = {
      //CONSULTS
    ctl_consulta_ResponsablePorUnidad,
    ctl_consulta_Por_ResponsableGlobalPorUnidad,
    ctl_ConsultaTodosResponsablePorIDUnidad,
    ctl_consulta_ResponsablePorIdResponsable,
    ctl_consultaResponsablesGlobalPorUnidad,
    //INSERT
    ctl_agregar_responsable,
    //UPDATE
    ctl_EditarResponsablePorIDConPassword,
    ctl_EditarResponsablePorIDSinPassword
    
}