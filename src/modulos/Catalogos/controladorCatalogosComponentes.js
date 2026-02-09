const db= require('../../DB/conexion');

const TABLA= 'catalogo_componentes';
const Utils = require("../Utils"); // Importamos el archivo de respuestas
/**//////////////////////////////////////////////////////////////////////////////////////////////////// */
//CONSULTAS
/**//////////////////////////////////////////////////////////////////////////////////////////////////// */
async function ctl_consulta_Catalogos_Por_Dispositivo_Busqueda(IdDispositivo,searchTerm){
     //return db.consulta_NumSerie_CodigoTI(TABLA, IdUnidad); 

     
     if(IdDispositivo==="" || IdDispositivo==null)
     {
        return { icon:"warning",error: true, message: "El campo no puede ir vacio"};  // Retorna respuesta de error
     }
     else
     {
           return db.consulta_Catalogos_Por_Dispositivo_Busqueda(TABLA, IdDispositivo,searchTerm);
      
    
     }
     
}

async function ctl_consulta_Todos_Catalogos_Por_Dispositivo(IdDispositivo){
     //return db.consulta_NumSerie_CodigoTI(TABLA, IdUnidad); 

     if(IdDispositivo==="" || IdDispositivo==null)
     {
        return { icon:"warning",error: true, message: "El campo no puede ir vacio"};  // Retorna respuesta de error
     }
     else
     {
           return db.consulta_Todos_Catalogos_Por_Dispositivo(TABLA, IdDispositivo);
      
    
     }
     //ctl_ConsultaCatalogoPorID
}

//CONSULTA CATALOGO POR ID COMPONENTE
async function ctl_ConsultaCatalogoPorID(Id_catalogo_componente){
   
  
       return db.ConsultaCatalogoPorID(TABLA,Id_catalogo_componente);
  
}
//ConsultaTodosCatalogosoBusqueda
async function ctl_ConsultaTodosCatalogosBusqueda(searchTerm){
   
  
       return db.ConsultaTodosCatalogosBusqueda(TABLA,searchTerm);
  
}

/****************************************************************************************************** */
//INSERT
/****************************************************************************************************** */
function ctl_InsertaryVerificarCatalogoComponente(DataCatalogoComponentes){
 
    return db.InsertaryVerificarCatalogoComponente(DataCatalogoComponentes);

}

/****************************************************************************************************** */
//UPDATE
/****************************************************************************************************** */
async function ctl_EditarCatalogoComponentesPorId(id_catalogo_componente, dataCatalogoComponente) {



    const validaridcatalogo = Utils.Validar_datos.validar_Campos_String(id_catalogo_componente, "El id de catalogo");
    const validarnombrecatalogo = Utils.Validar_datos.validar_Campos_String(dataCatalogoComponente.nombre_catalogo, "El nombre de catalogo");
    const validardescripcionmodelo = Utils.Validar_datos.validar_Campos_String(dataCatalogoComponente.descripcion_modelo, "La descripcion del modelo");
    const validarFK_id_dispositivo  = Utils.Validar_datos.validar_Campos_Numeric(dataCatalogoComponente.FK_id_dispositivo , "Id del dispositivo"); 
    const validarFK_id_marca_cata  = Utils.Validar_datos.validar_Campos_Numeric(dataCatalogoComponente.FK_id_marca_cata, "La marca del catalogo");
    const validarFK_catalogo_caracteristicas   = Utils.Validar_datos.validar_Campos_Numeric(dataCatalogoComponente.FK_catalogo_caracteristicas, "Las caracteristicas del catalogo");

    if (validaridcatalogo.error || validarnombrecatalogo.error || validardescripcionmodelo.error || validarFK_id_dispositivo.error
        || validarFK_id_marca_cata.error || validarFK_catalogo_caracteristicas.error
    ) {
        // Array de todas las validaciones para iterar
        const validations = [validaridcatalogo, validarnombrecatalogo, validardescripcionmodelo, validarFK_id_dispositivo, validarFK_id_marca_cata, validarFK_catalogo_caracteristicas];
        // Encontrar la primera validación que falló
        const failedValidation = validations.find(val => val.error);

        return {
            icon: failedValidation.icon || "warning",
            error: true,
            message: failedValidation.message || "Campo no válido",
        };
    }
    else {
        //VALIDACIONES CORRECTAS, PROCEDEMOS A EDITAR
        
        const Catalogo_Componente_Actualizado = await db.EditarCatalogoComponentesPorId(TABLA,dataCatalogoComponente, id_catalogo_componente);
        return { icon: "success", error: false, message: "Se ha Editado Correctamente", tittle: "¡Exito!", body: Catalogo_Componente_Actualizado };
    }

}
module.exports = {
    ctl_consulta_Catalogos_Por_Dispositivo_Busqueda,
    ctl_consulta_Todos_Catalogos_Por_Dispositivo,
    ctl_ConsultaTodosCatalogosBusqueda,
    ctl_InsertaryVerificarCatalogoComponente,
    ctl_ConsultaCatalogoPorID,

    //UPDATE
    ctl_EditarCatalogoComponentesPorId
    
}