const db = require('../../DB/conexion');
const bcrypt = require("bcrypt");
const TABLA = 'tecnico';
const config = require("../../config");
const Utils = require("../Utils"); // Importamos el archivo de respuestas


/****************************************************************************************************** */
//INSERT
/****************************************************************************************************** */
async function ctl_agregar_tecnico(tecnicoData) {
    const validarusername = Utils.Validar_datos.username(tecnicoData.usuario);
    const validarpassword = Utils.Validar_datos.password(tecnicoData.password);
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
    }
    else {
        tecnicoData.IsAdmin = varAdmin;
        const esDuplicado = await db.Verificar_Duplicidad_usuario_tecnico(TABLA, tecnicoData.usuario);
        console.log("esDuplicado", esDuplicado);
        if (esDuplicado) {
            return { icon: "warning", error: true, message: "Usuario Registrado", tittle: "Advertencia" }; // Enviar respuesta de error
        } else {
            // Usuario no existe, proceder a registrar
            const saltRounds = parseInt(config.salt_rounds);
            const passwordCIP = Utils.ConversionPasswords.ConversionContrasenaCIPDesktopEncriptar(tecnicoData.password);
            const encriptarpassword = tecnicoData.password;
            const hashedPassword = await bcrypt.hash(encriptarpassword, saltRounds);
            const nuevotecnico = await db.agregarTecnicos(TABLA, tecnicoData, hashedPassword, passwordCIP);
            return { icon: "success", error: false, message: "Agregado Correctamente", tittle: "¡Exito!", body: nuevotecnico };
        }

    }

}

/****************************************************************************************************** */
//CONSULT
/****************************************************************************************************** */
async function ctl_Consulta_Todos_Tecnicos(searchTerm) {

    return db.Consulta_Todos_Tecnicos(TABLA, searchTerm);

}

async function ctl_Consulta_Por_Tecnico(id_tecnico) {



    if (id_tecnico === "" || id_tecnico == null) {
        return { icon: "warning", error: true, message: "El campo no puede ir vacio" };  // Retorna respuesta de error
    }

    return db.Consulta_Por_Tecnico(TABLA, id_tecnico);

}


/****************************************************************************************************** */
//UPDATE
/****************************************************************************************************** */
async function ctl_EditartecnicoPorIDConPassword(id_tecnico, tecnicoData) {


    const validarusername = Utils.Validar_datos.username(tecnicoData.usuario);
    const validarpassword = Utils.Validar_datos.password(tecnicoData.password);
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
    }
    else {
        // Usuario no existe, proceder a registrar
        const saltRounds = parseInt(config.salt_rounds);
        const passwordCIP = Utils.ConversionPasswords.ConversionContrasenaCIPDesktopEncriptar(tecnicoData.password);
        const encriptarpassword = tecnicoData.password;
        const hashedPassword = await bcrypt.hash(encriptarpassword, saltRounds);
        const tecnico_actualizado = await db.EditartecnicoPorIDConPassword(TABLA, id_tecnico, tecnicoData, hashedPassword, passwordCIP);
        return { icon: "success", error: false, message: "Se ha Editado Correctamente", tittle: "¡Exito!", body: tecnico_actualizado };
    }

}

async function ctl_EditartecnicoPorIDSinPassword(id_tecnico, tecnicoData) {
   const validarusername = Utils.Validar_datos.username(tecnicoData.usuario);
    const validarnombre = Utils.Validar_datos.validar_Campos_String(tecnicoData.nombre, "El nombre");
    const validarcargo = Utils.Validar_datos.validar_Campos_Select(tecnicoData.cargo, "un cargo");
    const validarestatus_tecnico = Utils.Validar_datos.validar_Campos_Select(tecnicoData.estatus_tecnico, "un estatus de técnico");
    const varAdmin = tecnicoData.IsAdmin === "SI" ? 1 : 0;
    const validarestatus_isAdmin = Utils.Validar_datos.validar_Campos_Numeric(varAdmin, "El estatus de administrador");
    //Validar_datos.username(tecnicoData.usuario);

    if (validarusername.error  || validarnombre.error || validarcargo.error
        || validarestatus_tecnico.error || validarestatus_isAdmin.error
    ) {
        // Array de todas las validaciones para iterar
        const validations = [validarusername, validarnombre, validarcargo, validarestatus_tecnico, validarestatus_isAdmin];

        // Encontrar la primera validación que falló
        const failedValidation = validations.find(val => val.error);

        return {
            icon: failedValidation.icon || "warning",
            error: true,
            message: failedValidation.message || "Campo no válido",
        };
    }
    else {
        const tecnico_actualizado = await db.EditartecnicoPorIDSinPassword(TABLA, id_tecnico, tecnicoData);
        return { icon: "success", error: false, message: "Se ha Editado Correctamente", tittle: "¡Exito!", body: tecnico_actualizado };
    }
}






module.exports = {
    //*agregar
    ctl_agregar_tecnico,
    //*consultas */
    ctl_Consulta_Todos_Tecnicos,
    ctl_Consulta_Por_Tecnico,
    //*UPDATE
    ctl_EditartecnicoPorIDConPassword,
    ctl_EditartecnicoPorIDSinPassword,
}