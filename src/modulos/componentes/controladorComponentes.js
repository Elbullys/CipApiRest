const db = require('../../DB/conexion');
const Utils = require("../Utils"); // Importamos el archivo de respuestas
//COMPONENTES
const TABLA = 'componentes';
/**//////////////////////////////////////////////////////////////////////////////////////////////////// */
//consulta
/**//////////////////////////////////////////////////////////////////////////////////////////////////// */
function consulta_componente() {
    return db.consulta_componente(TABLA);
}


async function ctl_verificar_id_componente_QR_Num_Serie(databusqueda) {

    const componenteExist = await db.Verificar_Existencia_componente(TABLA, databusqueda);

    console.log("componenteExist", componenteExist);

    if (componenteExist == 0)//sin EXISTENCIA
    {

        return { icon: "warning", error: true, message: "No se encuentra registrado" }; // Enviar respuesta de error // Imprime el mensaje de error

    }
    else if (componenteExist >= 2)//DUPLICADO
    {
        return { icon: "warning", error: true, message: "Componente Duplicado" }; // Enviar respuesta de error // Imprime el mensaje de error
    }
    else (componenteExist == 1)//SI EXISTE
    {
        return { icon: "success", error: false, message: "Se encuentra registrado" }; // Enviar respuesta de éxito // Imprime el mensaje de éxito
        //return db.consulta_id_componente(TABLA, databusqueda);
    }


}
async function ctl_consulta_CodigoTI_Num_Serie(databusqueda) {
    return db.consulta_NumSerie_CodigoTI(TABLA, databusqueda);
}

async function ctl_consulta_Id_Componente(id_componente) {
    return db.consulta_id_componente(TABLA, id_componente);
}

async function ctl_consulta_conteo_componentes_TipoUnidad() {
    return db.consulta_conteo_componentes_TipoUnidad(TABLA);
}
async function ctl_consulta_conteo_componentes_ActivoBaja() {
    return db.consulta_conteo_componentes_ActivoBaja(TABLA);
}

//Inventario carga componente por colectivo 
async function ctl_InventarioComponentesPorColectivo(BusquedaEncabezados) {
    
    const {id_unidad,IdResponsable,id_area,id_dispositivo,id_catalogo_componente,status_componente}
    =BusquedaEncabezados;
 const validarid_unidad = Utils.Validar_datos.validar_Campos_Numeric(id_unidad);
 const validarIdResponsable = Utils.Validar_datos.validar_Campos_Numeric(IdResponsable);
 const validarid_area = Utils.Validar_datos.validar_Campos_Numeric(id_area);
 const validarid_dispositivo = Utils.Validar_datos.validar_Campos_Numeric(id_dispositivo);
 const validarid_catalogo_componente = Utils.Validar_datos.validar_Campos_Numeric(id_catalogo_componente);
 const validarid_status_componente = Utils.Validar_datos.validar_Campos_String(status_componente);
    
 if (validarid_unidad.error || validarIdResponsable.error || validarid_area.error || validarid_dispositivo.error
        || validarid_catalogo_componente.error || validarid_status_componente.error 
    ) {
        // Array de todas las validaciones para iterar
        const validations = [validarid_unidad, validarIdResponsable, validarid_area, validarid_dispositivo
            , validarid_catalogo_componente, validarid_status_componente
        ];

        // Encontrar la primera validación que falló
        const failedValidation = validations.find(val => val.error);


        return {
            icon: failedValidation.icon || "warning",
            error: true,
            message: failedValidation.message || "Campo no válido",
        };
    }
 
 return db.InventarioComponentesPorColectivo(TABLA, BusquedaEncabezados);
}

//INVENTARIO verificar numeros de serie existencia y duplicados
async function ctl_verificarnumeroserieComponenteExistenciaDuplicadoArray(series) {
  // Validar que 'series' es un array
  if (!Array.isArray(series) || series.length === 0) {
    return { icon: "warning", error: true, message: "Envía un array de series válido." };
  }

  // Sanitiza: filtra strings vacíos o no strings
  const seriesFiltradas = series.filter(s => typeof s === 'string' && s.trim() !== '');
  if (seriesFiltradas.length === 0) {
    return { icon: "warning", error: true, message: "No hay series válidas para verificar." };
  }

  // Limita para rendimiento
  if (seriesFiltradas.length > 1000) {
    return { icon: "warning", error: true, message: "Máximo 1000 series por request." };
  }

  try {

    const result = await db.verificarnumeroserieComponenteExistenciaDuplicadoArray(TABLA, seriesFiltradas);
    return result;  // Retorna { resultados } con detalles de similitudes
  } catch (error) {
    console.error("Error en controlador:", error);
    return { icon: "error", error: true, message: error.message };
  }
}

//INVENTARIO SELECCIONAR DATOS ANTERIORES ANTES DE ACTUALIZAR COLECTIVO DE COMPONENTES
async function ctl_consultaComponentesColectivoArray(componentes) {



  try {
   
    const result = await db.consultaComponentesColectivoArray(TABLA, componentes);
    return result;  // Retorna { resultados } con detalles de similitudes
  } catch (error) {
    console.error("Error en controlador:", error);
    return { icon: "error", error: true, message: error.message };
  }
}




/**//////////////////////////////////////////////////////////////////////////////////////////////////// */
//UPDATE
/**//////////////////////////////////////////////////////////////////////////////////////////////////// */
function ctl_Editar_ComponenteFactura(idComponente, data) {
    return db.EditarComponenteFactura(TABLA, idComponente, data);
}

async function ctl_Editar_ComponentePorID(idComponente, data, data_componentes_anteriores) {

    console.log("data",data);
    console.log("data_componentes_anteriores",data_componentes_anteriores);
    //VALIDAR DATOS ACTUALES
    const validarFK_id_unidad = Utils.Validar_datos.validar_Campos_Numeric(data.FK_id_unidad);
    const validaroperacion = Utils.Validar_datos.validar_Campos_String(data.operacion);
    const validarestado_equipo = Utils.Validar_datos.validar_Campos_String(data.estado_equipo);
    const validarAbreviatura_Estado = Utils.Validar_datos.validar_Campos_String(data.Abreviatura_Estado);
    const validarFK_Factura = Utils.Validar_datos.validar_Campos_Numeric(data.FK_Factura);
    const validarFK_id_responsable = Utils.Validar_datos.validar_Campos_Numeric(data.FK_id_responsable);
    const validarFK_id_area = Utils.Validar_datos.validar_Campos_Numeric(data.FK_id_area);
    const validarFK_id_dispositivo = Utils.Validar_datos.validar_Campos_Numeric(data.FK_id_dispositivo);
    const validarabreviatura_tipo = Utils.Validar_datos.validar_Campos_String(data.abreviatura_tipo);
    const validarFK_id_catalogo_componentes = Utils.Validar_datos.validar_Campos_Numeric(data.FK_id_catalogo_componentes);
    const validarnumero_serie = Utils.Validar_datos.validar_Campos_String(data.numero_serie);
    const validarnumero_consecutivo = Utils.Validar_datos.validar_Campos_Numeric(data.numero_consecutivo);
    const validarobservaciones = Utils.Validar_datos.validar_Campos_String(data.observaciones);
    const validarstatus_componente = Utils.Validar_datos.validar_Campos_String(data.status_componente);
    const validarstatus_inventario = Utils.Validar_datos.validar_Campos_Numeric(data.status_inventario);
    const validarEsClienteServidor = Utils.Validar_datos.validar_Campos_String(data.EsClienteServidor);
    const validarFK_IdTecnico = Utils.Validar_datos.validar_Campos_Numeric(data.FK_IdTecnico);

    //VALIDAD DATOS ANTERIORES
const validarFK_id_unidadAnterior = Utils.Validar_datos.validar_Campos_Numeric(data_componentes_anteriores.FK_id_unidad);
    const validaroperacionAnterior = Utils.Validar_datos.validar_Campos_String(data_componentes_anteriores.operacion);
    const validarestado_equipoAnterior = Utils.Validar_datos.validar_Campos_String(data_componentes_anteriores.estado_equipo);
    const validarAbreviatura_EstadoAnterior = Utils.Validar_datos.validar_Campos_String(data_componentes_anteriores.Abreviatura_Estado);
    const validarFK_FacturaAnterior = Utils.Validar_datos.validar_Campos_Numeric(data_componentes_anteriores.FK_Factura);
    const validarFK_id_responsableAnterior = Utils.Validar_datos.validar_Campos_Numeric(data_componentes_anteriores.FK_id_responsable);
    const validarFK_id_areaAnterior = Utils.Validar_datos.validar_Campos_Numeric(data_componentes_anteriores.FK_id_area);
    const validarFK_id_dispositivoAnterior = Utils.Validar_datos.validar_Campos_Numeric(data_componentes_anteriores.FK_id_dispositivo);
    const validarabreviatura_tipoAnterior = Utils.Validar_datos.validar_Campos_String(data_componentes_anteriores.abreviatura_tipo);
    const validarFK_id_catalogo_componentesAnterior = Utils.Validar_datos.validar_Campos_Numeric(data_componentes_anteriores.FK_id_catalogo_componentes);
    const validarnumero_serieAnterior = Utils.Validar_datos.validar_Campos_String(data_componentes_anteriores.numero_serie);
    const validarnumero_consecutivoAnterior = Utils.Validar_datos.validar_Campos_Numeric(data_componentes_anteriores.numero_consecutivo);
    const validarobservacionesAnterior = Utils.Validar_datos.validar_Campos_String(data_componentes_anteriores.observaciones);
    const validarstatus_componenteAnterior = Utils.Validar_datos.validar_Campos_String(data_componentes_anteriores.status_componente);
    const validarstatus_inventarioAnterior = Utils.Validar_datos.validar_Campos_Numeric(data_componentes_anteriores.status_inventario);
    const validarEsClienteServidorAnterior = Utils.Validar_datos.validar_Campos_String(data_componentes_anteriores.EsClienteServidor);
    //const validarFK_IdTecnicoAnterior = Utils.Validar_datos.validar_Campos_Numeric(data_componentes_anteriores.FK_IdTecnico);

    if (validarFK_id_unidad.error || validaroperacion.error || validarestado_equipo.error || validarAbreviatura_Estado.error
        || validarFK_Factura.error || validarFK_id_responsable.error || validarFK_id_area.error || validarFK_id_dispositivo.error
        || validarabreviatura_tipo.error || validarFK_id_catalogo_componentes.error || validarnumero_serie.error || validarnumero_consecutivo.error
        || validarobservaciones.error || validarstatus_componente.error || validarstatus_inventario.error || validarEsClienteServidor.error
        || validarFK_IdTecnico.error||
        //anteriores
        validarFK_id_unidadAnterior.error || validaroperacionAnterior.error || validarestado_equipoAnterior.error || validarAbreviatura_EstadoAnterior.error
        || validarFK_FacturaAnterior.error || validarFK_id_responsableAnterior.error || validarFK_id_areaAnterior.error || validarFK_id_dispositivoAnterior.error
        || validarabreviatura_tipoAnterior.error || validarFK_id_catalogo_componentesAnterior.error || validarnumero_serieAnterior.error || validarnumero_consecutivoAnterior.error
        || validarobservacionesAnterior.error || validarstatus_componenteAnterior.error || validarstatus_inventarioAnterior.error || validarEsClienteServidorAnterior.error
        

    ) {
        // Array de todas las validaciones para iterar
        const validations = [validarFK_id_unidad, validaroperacion, validarestado_equipo, validarAbreviatura_Estado
            , validarFK_Factura, validarFK_id_responsable, validarFK_id_area, validarFK_id_dispositivo,
            validarabreviatura_tipo, validarFK_id_catalogo_componentes, validarnumero_serie, validarnumero_consecutivo,
            validarobservaciones, validarstatus_componente, validarstatus_inventario, validarEsClienteServidor,
            validarFK_IdTecnico,
            //ANTERIORES
            validarFK_id_unidadAnterior, validaroperacionAnterior, validarestado_equipoAnterior, validarAbreviatura_EstadoAnterior
            , validarFK_FacturaAnterior, validarFK_id_responsableAnterior, validarFK_id_areaAnterior, validarFK_id_dispositivoAnterior,
            validarabreviatura_tipoAnterior, validarFK_id_catalogo_componentesAnterior, validarnumero_serieAnterior, validarnumero_consecutivoAnterior,
            validarobservacionesAnterior, validarstatus_componenteAnterior, validarstatus_inventarioAnterior, validarEsClienteServidorAnterior,
            

        ];

        // Encontrar la primera validación que falló
        const failedValidation = validations.find(val => val.error);


        return {
            icon: failedValidation.icon || "warning",
            error: true,
            message: failedValidation.message || "Campo no válido",
        };
    }
    else {

        //DATOS ACTUALES
        const operacionActual = data.operacion;
        const FK_id_dispositivoActual = data.FK_id_dispositivo;
        const Numeroconsecutivo=data.numero_consecutivo;
        const AbrevEstado= data.Abreviatura_Estado;
        const AbrevEQ= data.abreviatura_EQ;
        const abreviatura_tipo= data.abreviatura_tipo;
        const id_tecnico=data.FK_IdTecnico;

        //DATOS ANTERIORES
        const operacionAnterior = data_componentes_anteriores.operacion;
        const FK_id_dispositivoAnterior = data_componentes_anteriores.FK_id_dispositivo;

        //VARIABLE PARA GENERACION DE EQ
        let codigoTI=null;

        if (operacionActual !== operacionAnterior || FK_id_dispositivoActual!==FK_id_dispositivoAnterior) {

             let Numeroconsecutivo =await db.consulta_Max_consecutivo_PorDispositivo_y_Operacion(TABLA, FK_id_dispositivoActual, operacionActual);
            
            
             if (!Numeroconsecutivo) {
                Numeroconsecutivo = "1";
                data.numero_consecutivo=Numeroconsecutivo;
            }
            else {
                
                Numeroconsecutivo = (parseInt(Numeroconsecutivo) + 1).toString();
                data.numero_consecutivo=Numeroconsecutivo;
            }
             codigoTI = `${AbrevEQ}-${abreviatura_tipo}-${AbrevEstado}-${Numeroconsecutivo}`;
        }
        else{
             codigoTI = `${AbrevEQ}-${abreviatura_tipo}-${AbrevEstado}-${Numeroconsecutivo}`;
        }
        const GuardarMovimientoComponente= await db.agregarMovimientoComponente("movimientos_componentes",data_componentes_anteriores,data,codigoTI,idComponente);
        console.log("GuardarMovimientoComponente",GuardarMovimientoComponente);
        //if(GuardarMovimientoComponente.error==false && GuardarMovimientoComponente.s)

        return db.EditarComponentePorID(TABLA, idComponente, data,codigoTI);
    }

}
async function ctl_actualizarComponentesColectivo(componentes) {
  if (!Array.isArray(componentes) || componentes.length === 0) {
    return { icon: "warning", error: true, message: "Envía un array de componentes válido." };
  }

  try {
    const result = await db.actualizarComponentesColectivo(TABLA, componentes);
    return result;
  } catch (error) {
    return { icon: "error", error: true, message: error.message };
  }
}

module.exports = {
    //CONSULTA
    ctl_consulta_CodigoTI_Num_Serie,
    consulta_componente,
    ctl_verificar_id_componente_QR_Num_Serie,
    ctl_consulta_Id_Componente,
    ctl_consulta_conteo_componentes_TipoUnidad,
    ctl_consulta_conteo_componentes_ActivoBaja,
    ctl_InventarioComponentesPorColectivo,
    ctl_verificarnumeroserieComponenteExistenciaDuplicadoArray,
    ctl_consultaComponentesColectivoArray,

    //UPDATE
    ctl_Editar_ComponenteFactura,
    ctl_Editar_ComponentePorID,
    ctl_actualizarComponentesColectivo
}