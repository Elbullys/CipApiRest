// utils.js - Archivo para funciones y utilidades globales reutilizables

class Validar_datos {

    static username(username) {
        // Verificar si username está definido
        if (typeof username === "undefined") {

            return {
                icon: "warning",
                error: true,
                message: "El nombre de usuario no está definido.",
            };
        }

        else if (!username || username.length < 3) {

            return {
                icon: "warning",
                error: true,
                message: "El Usuario es Incorrecto",
            };
            // return { icon:"warning",error: true, message: "El nombre de usuario ya está en uso." };
        }
        return { icon: "check", error: false, message: "Datos válidos" };
    }

    static password(Password) {
        if (typeof Password === "undefined") {
            console.log("password desconocido");
            return {
                icon: "warning",
                error: true,
                message: "La contraseña no está definida.",
            };
        }

        const password = Password;
        // Expresión regular para validar la contraseña
        //const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/; // Al menos una mayúscula, un número y longitud mínima de 6 caracteres
        if (Password.length < 3) {
            console.log("password tamaño");
            return {
                icon: "warning",
                error: true,
                message: "La contraseña debe tener al menos 3 caracteres.",
            };
        }
        return { icon: "check", error: false, message: "Datos válidos" };
    }

    static validar_Campos_String(ValidarDato, campo) {

        if (!ValidarDato || ValidarDato.toString().trim() === "" || ValidarDato.toString() === "unfined") {
            return { icon: "warning", error: true, message: "" + campo + " no puede estar vacío." };
        }


        return { icon: "check", error: false, message: "Datos válidos" };
    }
    static validar_Campos_Select(ValidarDato, campo) {
        // Verifica si el dato es null, undefined, o una cadena vacía (después de trim)
        if (!ValidarDato || ValidarDato.toString().trim() === "" || ValidarDato === "Selecciona") {
            return { icon: "warning", error: true, message: "Selecciona " + campo + " válido." };
        }
        // Si pasa la validación, retorna éxito
        return { icon: "success", error: false, message: "Campo válido." };
    }
    
    static validar_Campos_Numeric(ValidarDato, campo) {
    
        // Verificar si el campo está vacío o nulo
        if ( ValidarDato.toString().trim() === "") {
            return { icon: "warning", error: true, message: "" + campo + " no puede estar vacio o no es Válido" };
        }

        // Verificar si NO es un número (isNaN devuelve true si no es numérico)
        if (isNaN(ValidarDato)) {
            return { icon: "warning", error: true, message: "" + campo + " no es válido, solo números." };
        }

        // Si pasa ambas verificaciones, es válido
        return { icon: "check", error: false, message: "Datos válidos" };
    }

  


}

class ConversionPasswords {
 static ConversionContrasenaCIPDesktopEncriptar(contrasenaCIP) {
    let result = ""; // Inicializar como string vacío
    // Convertir la string a bytes UTF-8
    const encoder = new TextEncoder();
    const bytes = encoder.encode(contrasenaCIP);
    // Convertir bytes a Base64 usando Buffer (Node.js)
    result = Buffer.from(bytes).toString('base64');
    return result;
}
}



module.exports = {
    //VALIDAD CAMPOS 
    Validar_datos,
    ConversionPasswords,
};