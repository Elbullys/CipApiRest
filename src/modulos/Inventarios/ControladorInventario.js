const db = require('../../DB/conexion');
const Utils = require("../Utils"); // Importamos el archivo de respuestas
//COMPONENTES
//const TABLA = 'componentes';
async function ctl_InventarioComponentesPorColectivo(BusquedaEncabezados) {
    const {id_unidad,IdResponsable,id_area,id_dispositivo,id_catalogo_componente,status_componente,FK_Factura }
    =BusquedaEncabezados;
 const validarid_unidad = Utils.Validar_datos.validar_Campos_Numeric(id_unidad);
 const validarIdResponsable = Utils.Validar_datos.validar_Campos_Numeric(IdResponsable);
 const validarid_area = Utils.Validar_datos.validar_Campos_Numeric(id_area);
 const validarid_dispositivo = Utils.Validar_datos.validar_Campos_Numeric(id_dispositivo);
 const validarid_catalogo_componente = Utils.Validar_datos.validar_Campos_Numeric(id_catalogo_componente);
 const validarid_FK_Factura  = Utils.Validar_datos.validar_Campos_Numeric(FK_Factura );
 const validarid_status_componente = Utils.Validar_datos.validar_Campos_String(status_componente);
    
 if (validarid_unidad.error || validarIdResponsable.error || validarid_area.error || validarid_dispositivo.error
        || validarid_catalogo_componente.error || validarid_status_componente.error ||validarid_FK_Factura.error
    ) {
        // Array de todas las validaciones para iterar
        const validations = [validarid_unidad, validarIdResponsable, validarid_area, validarid_dispositivo
            , validarid_catalogo_componente, validarid_status_componente,validarid_FK_Factura
        ];

        // Encontrar la primera validación que falló
        const failedValidation = validations.find(val => val.error);


        return {
            icon: failedValidation.icon || "warning",
            error: true,
            message: failedValidation.message || "Campo no válido",
        };
    }
 
 return db.InventarioComponentesPorColectivo(BusquedaEncabezados);
}


module.exports = {
    //CONSULTA
  
    ctl_InventarioComponentesPorColectivo

}