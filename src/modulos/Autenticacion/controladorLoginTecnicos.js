const db = require('../../DB/conexion');
const bcrypt = require("bcrypt");
const morgan = require("morgan");
const config = require("../../config");
const Utils = require("../Utils"); // Importamos el archivo de respuestas
const TABLA = 'tecnico';

async function ctl_login_tecnico(Data) {

    const username = Data.username;
    const PasswordWeb = Data.Password;

    const validarusername = Utils.Validar_datos.username(username);
    const validarpassword = Utils.Validar_datos.password(PasswordWeb);

   
    if (validarusername.error || validarpassword.error ) {
        // Array de todas las validaciones para iterar
        const validations = [validarusername, validarpassword];

        // Encontrar la primera validación que falló
        const failedValidation = validations.find(val => val.error);

        return {
            icon: failedValidation.icon || "warning",
            error: true,
            message: failedValidation.message || "Campo no válido",
        };
    } else {
        
        try {
            const usuarioExistente = await db.Verificar_Existencia_usuario_tecnico(TABLA, username);

            if (!usuarioExistente) {
                return { icon: "warning", error: true, message: "Usuario No Registrado" };
            } else {
                
                const isValidPassword = bcrypt.compareSync(PasswordWeb, usuarioExistente.PasswordWeb);  // Asumiendo que la columna se llama 'password'
                console.log("isValidPassword..", isValidPassword);

                if (!isValidPassword) {
                    return {
                        icon: "warning",
                        error: true,
                        message: "Contraseña Incorrecta",
                    };
                } else {

                    // Devuelve los datos públicos (sin la contraseña)
                    return {
                        icon: "success",
                        error: false,
                        message: "¡Bienvenido Tecnico!",
                        usuario: usuarioExistente.usuario,  
                        id_tecnico: usuarioExistente.id_tecnico,  
                         IsAdmin: usuarioExistente.IsAdmin,
                    };
                }
            }
        } catch (error) {
            console.error("Error en la verificación:", error);
            return { icon: "error", error: true, message: "Error interno del servidor" };
        }
    }
}




module.exports = {
    ctl_login_tecnico,

}