const db = require('../../DB/conexion');
const bcrypt = require("bcrypt");
const TABLA = 'tecnico';
const config = require("../../config");
const Utils = require("../Utils"); // Importamos el archivo de respuestas

async function ctl_agregar_tecnico(tecnicoData) {
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
    }
    else {
        tecnicoData.IsAdmin = varAdmin;
        const esDuplicado = await db.Verificar_Existencia_usuario_tecnico(TABLA, tecnicoData.usuario);
   if (esDuplicado) {  
       return { icon: "warning", error: true, message: "Usuario Registrado" }; // Enviar respuesta de error
   } else {
       // Usuario no existe, proceder a registrar
       const saltRounds = parseInt(config.salt_rounds);
       const passwordCIP = Utils.ConversionPasswords.ConversionContrasenaCIPDesktopEncriptar(tecnicoData.password);
       const encriptarpassword = tecnicoData.PasswordWeb;  // Nota: Esto parece ser la contraseña en texto plano; asegúrate de que sea correcta
       const hashedPassword = await bcrypt.hash(encriptarpassword, saltRounds);
       const nuevotecnico = await db.agregarTecnicos(TABLA, tecnicoData, hashedPassword, passwordCIP);
       return { error: false, body: nuevotecnico };
   }

    }

}





module.exports = {
    ctl_agregar_tecnico,

}