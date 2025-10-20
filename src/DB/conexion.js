const { getConnection } = require("./db");
const config = require("../config");

async function consulta_componente(tabla) {
  let connection;
  try {
    connection = await getConnection(); // Obtener conexión del pool

    
    // Realizar la consulta
    const [result] = await connection.query(`
      SELECT U.id_unidad, U.nombre_unidad, D.tipo_equipo, M.marca, M.modelo,
             C.numero_serie, C.codigo_TI, CT.num_contrato_actual, C.operacion
      FROM ${tabla} C
      INNER JOIN unidad U ON U.id_unidad = C.FK_id_unidad
      INNER JOIN responsable R ON R.id_responsable = C.FK_id_responsable
      INNER JOIN catalogo_componentes CC ON CC.id_catalogo_componente = C.FK_id_catalogo_componentes
      INNER JOIN marca M ON M.id_marca = CC.FK_id_marca_cata
      INNER JOIN dispositivos D ON D.id_dispositivo = C.FK_id_dispositivo
      INNER JOIN area A ON A.id_area = R.FK_id_area
      INNER JOIN contrato CT ON CT.id_contrato = 1 WHERE C.id_componente =1
    `);

    return result; // Retorna el resultado de la consulta
  } catch (error) {
    console.error("[db error]", error);
    throw error; // Lanza el error para manejarlo más arriba
  } finally {
    if (connection) {
      connection.release(); // Libera la conexión de vuelta al pool
    }
  }
}

async function consulta_NumSerie_CodigoTI(tabla, databusqueda) {
  console.log("databusqueda en db", databusqueda);  
  let connection;
  try {
    connection = await getConnection(); // Obtener conexión del pool

    const [result] = await connection.query(`
      SELECT U.id_unidad, R.nombre_responsable, U.nombre_unidad, A.area, C.operacion,
             D.tipo_equipo, M.marca, M.modelo, C.numero_serie, C.codigo_TI, C.observaciones,
             C.status_componente, C.status_inventario, CT.num_contrato_actual, T.nombre,
             C.FechaRegistro, C.EsClienteServidor, C.FechaCompra, CF.NumeroFactura,
             CF.NombreProveedor, CF.LugarCompra, CF.FechaFactura,C.id_componente
      FROM ${tabla} C
      INNER JOIN unidad U ON U.id_unidad = C.FK_id_unidad
      INNER JOIN responsable R ON R.id_responsable = C.FK_id_responsable
      INNER JOIN catalogo_componentes CC ON CC.id_catalogo_componente = C.FK_id_catalogo_componentes
      INNER JOIN marca M ON M.id_marca = CC.FK_id_marca_cata
      INNER JOIN dispositivos D ON D.id_dispositivo = C.FK_id_dispositivo
      INNER JOIN area A ON A.id_area = C.FK_id_area
      INNER JOIN contrato CT ON CT.id_contrato = (
          SELECT MAX(id_contrato) FROM contrato
      )
      INNER JOIN tecnico T ON T.id_tecnico = C.FK_IdTecnico
      JOIN componente_factura AS CF ON CF.IdFactura = C.FK_Factura
      WHERE C.codigo_TI = ? OR C.numero_serie = ?
    `, [databusqueda, databusqueda]);

    return result; // Retorna el resultado de la consulta
  } catch (error) {
    console.error("[db error]", error);
    throw error; // Lanza el error para manejarlo más arriba
  } finally {
    if (connection) {
      connection.release(); // Libera la conexión de vuelta al pool
    }
  }
}

async function Verificar_Existencia_componente(tabla, databusqueda) {
  let connection;
  try {
    connection = await getConnection(); // Obtener conexión del pool

    const [result] = await connection.query(`SELECT COUNT(*) AS count FROM ?? WHERE codigo_TI = ? OR numero_serie = ?`, [tabla, databusqueda, databusqueda]);
    console.log("result", result[0].count);
    return result[0].count > 0; // Retorna true si existe, false si no
  } catch (error) {
    console.error("[db error]", error);
    throw error; // Lanza el error para manejarlo más arriba
  } finally {
    if (connection) {
      connection.release(); // Libera la conexión de vuelta al pool
    }
  }
}

async function consulta_id_componente(tabla, id_componente) {
 
  let connection;
  try {
    connection = await getConnection(); // Obtener conexión del pool

    const [result] = await connection.query(`
      SELECT U.id_unidad,U.tipo_unidad, R.nombre_responsable, U.nombre_unidad, A.area, C.operacion,
             D.id_dispositivo,D.tipo_equipo,CC.id_catalogo_componente, M.marca, M.modelo, C.numero_serie, C.codigo_TI, C.observaciones,
             C.status_componente, C.status_inventario, CT.num_contrato_actual, T.nombre,
             C.FechaRegistro, C.EsClienteServidor, C.FechaCompra,CF.IdFactura, CF.NumeroFactura,
             CF.NombreProveedor, CF.LugarCompra, CF.FechaFactura,CF.Observacion,C.id_componente,CC.descripcion_modelo
      FROM ${tabla} C
      INNER JOIN unidad U ON U.id_unidad = C.FK_id_unidad
      INNER JOIN responsable R ON R.id_responsable = C.FK_id_responsable
      INNER JOIN catalogo_componentes CC ON CC.id_catalogo_componente = C.FK_id_catalogo_componentes
      INNER JOIN marca M ON M.id_marca = CC.FK_id_marca_cata
      INNER JOIN dispositivos D ON D.id_dispositivo = C.FK_id_dispositivo
      INNER JOIN area A ON A.id_area = C.FK_id_area
      INNER JOIN contrato CT ON CT.id_contrato = (
          SELECT MAX(id_contrato) FROM contrato
      )
      INNER JOIN tecnico T ON T.id_tecnico = C.FK_IdTecnico
      JOIN componente_factura AS CF ON CF.IdFactura = C.FK_Factura
      WHERE C.id_componente = ?
    `, [id_componente]);

    return result; // Retorna el resultado de la consulta
  } catch (error) {
    console.error("[db error]", error);
    throw error; // Lanza el error para manejarlo más arriba
  } finally {
    if (connection) {
      connection.release(); // Libera la conexión de vuelta al pool
    }
  }
}


//UNIDADES
async function consulta_Por_Unidad(tabla, databusqueda) {
  let connection;
  try {
    connection = await getConnection(); // Obtener conexión del pool

    const [result] = await connection.query(`
      SELECT U.id_unidad, U.numero_jurisdiccion,
      U.jurisdiccion, U.tipo_unidad, U.nombre_unidad, U.municipio,
      U.Estado, U.abreviatura_estado, U.estado_unidad, CT.num_contrato_actual        
      FROM ${tabla} U INNER JOIN contrato CT ON CT.id_contrato = (
          SELECT MAX(id_contrato) FROM contrato
      ) WHERE U.id_unidad = ? OR U.nombre_unidad LIKE ?
      ORDER BY id_unidad ASC
    `, [databusqueda, '%' + databusqueda + '%']);
    
    console.log("result", result);
    return result; // Retorna el resultado de la consulta
   
  } catch (error) {
    console.error("[db error]", error);
    throw error; // Lanza el error para manejarlo más arriba
  } finally {
    if (connection) {
      connection.release(); // Libera la conexión de vuelta al pool
    }
  }
}


//AREAS
//PERMITE REALIZAR BUSQUEDA ESPECIFICA DE AREAS DONDE COINCIDA EL TIPO DE UNIDAD
async function consulta_Area_Por_TipoUnidad(tabla, TipoUnidad,searchTerm) {
  
  let connection;
  try {
    connection = await getConnection(); // Obtener conexión del pool
    const [result] = await connection.query(`
      SELECT A.id_area,A.area,A.tipo_unidad,A.DescripcionArea
      FROM ${tabla} A
      WHERE A.area LIKE ? AND A.tipo_unidad = ? AND A.Status = 'ACTIVO' 
    `, [ '%'+ searchTerm +'%',TipoUnidad]);

    return result; // Retorna el resultado de la consulta
  } catch (error) {
    console.error("[db error]", error);
    throw error; // Lanza el error para manejarlo más arriba
  } finally {
    if (connection) {
      connection.release(); // Libera la conexión de vuelta al pool
    }
  }
}
//PERMITE REALIZAR EL MUESTREO DE TODAS LAS AREAS EXISTENTES DONDE COINCIDA EL TIPO DE UNIDAD
async function consulta_Todas_Areas_Por_TipoUnidad(tabla, TipoUnidad) {
  
  let connection;
  try {
    connection = await getConnection(); // Obtener conexión del pool

    const [result] = await connection.query(`
      SELECT A.id_area,A.area,A.tipo_unidad,A.DescripcionArea
      FROM ${tabla} A 
      WHERE A.tipo_unidad = ? AND A.Status = 'ACTIVO'
    `, [TipoUnidad]);

    return result; // Retorna el resultado de la consulta
  } catch (error) {
    console.error("[db error]", error);
    throw error; // Lanza el error para manejarlo más arriba
  } finally {
    if (connection) {
      connection.release(); // Libera la conexión de vuelta al pool
    }
  }
}

//DISPOSITIVOS
async function consulta_TODOS_dispositivos(tabla) {

  let connection;
  try {
    connection = await getConnection(); // Obtener conexión del pool

    const [result] = await connection.query(`
      SELECT id_dispositivo,tipo_equipo,abreviatura_tipo,descripcion_equipo,CaracteristicasAdicionales 
      FROM ${tabla} D 
      WHERE  status_dispositivos = 'ACTIVO' ORDER BY tipo_equipo ASC
    `);

    return result; // Retorna el resultado de la consulta
  } catch (error) {
    console.error("[db error]", error);
    throw error; // Lanza el error para manejarlo más arriba
  } finally {
    if (connection) {
      connection.release(); // Libera la conexión de vuelta al pool
    }
  }
}

async function consulta_Por_Dispositivo_Busqueda(tabla,searchTerm) {

  let connection;
  try {
    connection = await getConnection(); // Obtener conexión del pool

    const [result] = await connection.query(`
      SELECT id_dispositivo,tipo_equipo,abreviatura_tipo,descripcion_equipo,CaracteristicasAdicionales 
      FROM ${tabla} D 
      WHERE  status_dispositivos = 'ACTIVO' AND tipo_equipo LIKE ? ORDER BY tipo_equipo ASC
    `, [ '%'+ searchTerm +'%']);

    return result; // Retorna el resultado de la consulta
  } catch (error) {
    console.error("[db error]", error);
    throw error; // Lanza el error para manejarlo más arriba
  } finally {
    if (connection) {
      connection.release(); // Libera la conexión de vuelta al pool
    }
  }
}

//CATALOGO COMPONENTES
async function consulta_Catalogos_Por_Dispositivo_Busqueda(tabla, IdDispositivo,searchTerm) {
  
  let connection;
  try {
    connection = await getConnection(); // Obtener conexión del pool
    const [result] = await connection.query(`
      select CC.id_catalogo_componente, CC.nombre_catalogo,CC.descripcion_modelo, D.tipo_equipo,
       M.marca, M.modelo,CONCAT( CP.Fabricante,' ',CP.serie,' ',CP.modelo) AS 'Procesador',
       CONCAT (CMR.CapacidadGB,' ',CMR.Tipo) AS 'Memoria Ram',CONCAT(CDD.Tipo,' ',CDD.Capacidad_GB)
        AS 'Disco Duro', CONCAT (CSO.Nombre,' ',CSO.VersIon_SO,' ',CSO.Arquitectura) AS 'Sistema Operativo'
         FROM ${tabla} AS CC JOIN dispositivos AS D ON CC.FK_id_dispositivo=D.id_dispositivo  JOIN marca AS M 
         ON CC.FK_id_marca_cata=M.id_marca JOIN catalogo_componente_caracteristicas AS CCC 
         ON CCC.id_catalogo_caract=CC.FK_catalogo_caracteristicas JOIN Cat_sistema_operativo 
         AS CSO ON CSO.IdSistemaOperativo=CCC.SistemaOperativoID JOIN Cat_procesador AS CP 
         ON CP.IdProcesador=CCC.ProcesadorID JOIN Cat_memoria_ram AS CMR ON 
         CMR.IdMemoriaRam=CCC.MemoriaRamID JOIN Cat_disco_duro AS CDD ON CDD.IdDiscoDuro=CCC.DiscoDuroID
          WHERE CC.FK_id_dispositivo = ? 
          AND (CC.nombre_catalogo LIKE ? OR M.marca LIKE ? OR M.modelo LIKE ?)
          ORDER BY CC.nombre_catalogo ASC
           
    `, [IdDispositivo,'%'+ searchTerm +'%','%'+ searchTerm +'%','%'+ searchTerm +'%']);

    return result; // Retorna el resultado de la consulta
  } catch (error) {
    console.error("[db error]", error);
    throw error; // Lanza el error para manejarlo más arriba
  } finally {
    if (connection) {
      connection.release(); // Libera la conexión de vuelta al pool
    }
  }
}
//PERMITE REALIZAR EL MUESTREO DE TODAS LAS AREAS EXISTENTES DONDE COINCIDA EL TIPO DE UNIDAD
async function consulta_Todos_Catalogos_Por_Dispositivo(tabla, IdDispositivo) {
  
  let connection;
  try {
    connection = await getConnection(); // Obtener conexión del pool

    const [result] = await connection.query(`
      select CC.id_catalogo_componente, CC.nombre_catalogo,CC.descripcion_modelo, D.tipo_equipo,
       M.marca, M.modelo,CONCAT( CP.Fabricante,' ',CP.serie,' ',CP.modelo) AS 'Procesador',
       CONCAT (CMR.CapacidadGB,' ',CMR.Tipo) AS 'Memoria Ram',CONCAT(CDD.Tipo,' ',CDD.Capacidad_GB)
        AS 'Disco Duro', CONCAT (CSO.Nombre,' ',CSO.VersIon_SO,' ',CSO.Arquitectura) AS 'Sistema Operativo'
         FROM ${tabla} AS CC JOIN dispositivos AS D ON CC.FK_id_dispositivo=D.id_dispositivo  JOIN marca AS M 
         ON CC.FK_id_marca_cata=M.id_marca JOIN catalogo_componente_caracteristicas AS CCC 
         ON CCC.id_catalogo_caract=CC.FK_catalogo_caracteristicas JOIN Cat_sistema_operativo 
         AS CSO ON CSO.IdSistemaOperativo=CCC.SistemaOperativoID JOIN Cat_procesador AS CP 
         ON CP.IdProcesador=CCC.ProcesadorID JOIN Cat_memoria_ram AS CMR ON 
         CMR.IdMemoriaRam=CCC.MemoriaRamID JOIN Cat_disco_duro AS CDD ON CDD.IdDiscoDuro=CCC.DiscoDuroID
          WHERE CC.FK_id_dispositivo = ?  ORDER BY CC.nombre_catalogo ASC
    `, [IdDispositivo]);

    return result; // Retorna el resultado de la consulta
  } catch (error) {
    console.error("[db error]", error);
    throw error; // Lanza el error para manejarlo más arriba
  } finally {
    if (connection) {
      connection.release(); // Libera la conexión de vuelta al pool
    }
  }
}


module.exports = {
  //COMPONENTES
  consulta_NumSerie_CodigoTI,
  consulta_componente,
  Verificar_Existencia_componente,
  consulta_id_componente,
 

  //UNIDADES
 consulta_Por_Unidad,
  //AREAS
  consulta_Area_Por_TipoUnidad,
  consulta_Todas_Areas_Por_TipoUnidad,

  //DISPOSITIVOS
  consulta_TODOS_dispositivos,
  consulta_Por_Dispositivo_Busqueda,

  //CATALOGO COMPONENTES
consulta_Catalogos_Por_Dispositivo_Busqueda,
consulta_Todos_Catalogos_Por_Dispositivo,
};
