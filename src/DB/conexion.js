const { getConnection } = require("./db");
const config = require("../config");

//COMPONENTES
async function consulta_componente(tabla) {
  let connection;
  try {
    connection = await getConnection(); // Obtener conexión del pool

    /*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
    /*COMPONENTES*/
    /*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
    /** CONSULTAS */
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
      SELECT U.id_unidad,U.abreviatura_estado,U.tipo_unidad,R.id_responsable, R.nombre_responsable,R.cargo,A.Area, U.nombre_unidad,U.Estado,C.estado_equipo,C.FK_id_area, A.area, C.operacion,
             D.id_dispositivo,D.tipo_equipo,D.abreviatura_tipo,CC.id_catalogo_componente, M.marca, M.modelo, C.numero_serie,C.numero_consecutivo, C.codigo_TI, C.observaciones,
             C.status_componente, C.status_inventario, CT.num_contrato_actual, T.nombre,
             C.FechaRegistro, C.EsClienteServidor, C.FechaCompra,CF.IdFactura, CF.NumeroFactura,
             CF.NombreProveedor, CF.LugarCompra, CF.FechaFactura,CF.Observacion,C.id_componente,CC.descripcion_modelo
      FROM ${tabla} C
      INNER JOIN unidad U ON U.id_unidad = C.FK_id_unidad
      INNER JOIN responsable R ON R.id_responsable = C.FK_id_responsable
      INNER JOIN area AR ON AR.id_area = R.FK_id_area
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

async function consulta_Max_consecutivo_PorDispositivo_y_Operacion(tabla, FK_id_dispositivo, operacion) {


  let connection;
  try {
    connection = await getConnection(); // Obtener conexión del pool

    const [rows] = await connection.query(`
      select Max(numero_consecutivo) AS max_consecutivo FROM ${tabla} where FK_id_dispositivo = ? AND operacion= ?
    `, [FK_id_dispositivo, operacion]);

    if (rows.length > 0 && rows[0].max_consecutivo !== null) {
      return rows[0].max_consecutivo;  // Retorna solo el número (ej. 451)
    } else {
      return null;  // Si no hay resultados o es null
    }
  } catch (error) {
    console.error("[db error]", error);
    throw error; // Lanza el error para manejarlo más arriba
  } finally {
    if (connection) {
      connection.release(); // Libera la conexión de vuelta al pool
    }
  }
}

//UPDTATE
async function EditarComponenteFactura(tabla, idComponente, data) {
  let connection;

  try {
    const { idFactura } = data;

    connection = await getConnection(); // Obtener conexión del pool
    const [result] = await connection.query(`
      UPDATE ${tabla} 
      SET FK_Factura= ? 
      WHERE id_componente = ?
    `, [idFactura, idComponente]);
    return result; // Retorna el resultado de la consulta
  }

  catch (error) {
    console.error("[db error]", error);
    throw error; // Lanza el error para manejarlo más arriba
  } finally {
    if (connection) {
      connection.release(); // Libera la conexión de vuelta al pool
    }
  }
}

async function EditarComponentePorID(tabla, idComponente, data, codigo_TI) {
  let connection;
 console.log("data en bd",data);
  try {
    const { FK_Factura, operacion, numero_serie, estado_equipo, numero_consecutivo, observaciones, status_componente, status_inventario,
      FK_id_responsable, FK_id_unidad, FK_id_dispositivo, FK_id_catalogo_componentes,
      FK_id_area, FK_IdTecnico, EsClienteServidor, FechaCompra,
    } = data;

   
    connection = await getConnection(); // Obtener conexión del pool
    const [result] = await connection.query(`
      UPDATE ${tabla} 
      SET FK_Factura= ?,operacion= ?,numero_serie = ?, estado_equipo = ?,
      numero_consecutivo = ?,codigo_TI = ?,observaciones = ?,
      status_componente = ?,status_inventario = ?,FK_id_responsable = ?, FK_id_unidad = ?,
      FK_id_dispositivo = ?, FK_id_catalogo_componentes = ?,FK_id_area = ? , EsClienteServidor = ?, FechaCompra = ? 
      WHERE id_componente = ?
    `, [FK_Factura, operacion, numero_serie, estado_equipo, numero_consecutivo,
      codigo_TI, observaciones, status_componente, status_inventario,
      FK_id_responsable, FK_id_unidad, FK_id_dispositivo, FK_id_catalogo_componentes,
      FK_id_area, EsClienteServidor, FechaCompra, idComponente]);
    return {result,codigo_TI}; // Retorna el resultado de la consulta
  }

  catch (error) {
    console.error("[db error]", error);
    throw error; // Lanza el error para manejarlo más arriba
  } finally {
    if (connection) {
      connection.release(); // Libera la conexión de vuelta al pool
    }
  }
}


/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
//*UNIDADES*/
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
/** CONSULTAS */

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

/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
//*AREAS*/
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
/** CONSULTAS */


//PERMITE REALIZAR BUSQUEDA ESPECIFICA DE AREAS DONDE COINCIDA EL TIPO DE UNIDAD
async function consulta_Area_Por_TipoUnidad(tabla, TipoUnidad, searchTerm) {

  let connection;
  try {
    connection = await getConnection(); // Obtener conexión del pool
    const [result] = await connection.query(`
      SELECT A.id_area,A.area,A.tipo_unidad,A.DescripcionArea
      FROM ${tabla} A
      WHERE A.area LIKE ? AND A.tipo_unidad = ? AND A.Status = 'ACTIVO' 
    `, ['%' + searchTerm + '%', TipoUnidad]);

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



/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
//*RESPONSABLES*/
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
/** CONSULTAS */
async function consulta_ResponsablePorUnidad(tabla, searchTerm, idUnidad) {

  let connection;
  try {
    connection = await getConnection(); // Obtener conexión del pool
    const [result] = await connection.query(`
      SELECT R.id_responsable ,R.nombre_responsable,R.cargo,U.nombre_unidad ,A.Area
      FROM ${tabla} R JOIN unidad U ON U.id_unidad=R.FK_idunidad JOIN area AS A ON A.id_area=R.FK_id_area 
      WHERE  R.FK_idunidad = ? AND R.nombre_responsable LIKE ?  AND R.estado_responsable = 'ACTIVO' 
    `, [ idUnidad,'%' + searchTerm + '%']);

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
//PERMITE REALIZAR EL MUESTREO DE TODAS LOS RESPONSABLES EXISTENTES DONDE COINCIDA EL ID DE UNIDAD
async function ConsultaTodosResponsablePorIDUnidad(tabla, idUnidad) {

  let connection;
  try {
    connection = await getConnection(); // Obtener conexión del pool

    const [result] = await connection.query(`
      SELECT R.id_responsable ,R.nombre_responsable,R.cargo,A.Area 
      FROM ${tabla} R JOIN unidad U ON U.id_unidad=R.FK_idunidad  JOIN area AS A ON A.id_area=R.FK_id_area 
      WHERE R.FK_idunidad = ? AND R.estado_responsable = 'ACTIVO'
    `, [idUnidad]);

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
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
//*DISPOSITIVOS*/
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
/** CONSULTAS */


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

async function consulta_Por_Dispositivo_Busqueda(tabla, searchTerm) {

  let connection;
  try {
    connection = await getConnection(); // Obtener conexión del pool

    const [result] = await connection.query(`
      SELECT id_dispositivo,tipo_equipo,abreviatura_tipo,descripcion_equipo,CaracteristicasAdicionales 
      FROM ${tabla} D 
      WHERE  status_dispositivos = 'ACTIVO' AND tipo_equipo LIKE ? ORDER BY tipo_equipo ASC
    `, ['%' + searchTerm + '%']);

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
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
//*CATALOGO COMPONENTES*/
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
/** CONSULTAS */

async function consulta_Catalogos_Por_Dispositivo_Busqueda(tabla, IdDispositivo, searchTerm) {

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
           
    `, [IdDispositivo, '%' + searchTerm + '%', '%' + searchTerm + '%', '%' + searchTerm + '%']);

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

/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
//*FACTURAS*/
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
/** CONSULTAS */

async function consulta_Todas_Facturas(tabla) {

  let connection;
  try {
    connection = await getConnection(); // Obtener conexión del pool

    const [result] = await connection.query(`
      SELECT *  FROM ${tabla} ORDER BY IdFactura DESC `);

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

async function consulta_Factura_Busqueda(tabla, searchTerm) {

  let connection;
  try {
    connection = await getConnection(); // Obtener conexión del pool
    const [result] = await connection.query(`
      SELECT *  FROM ${tabla} 
          WHERE IdFactura = ? OR NombreProveedor LIKE ? OR LugarCompra LIKE ?  
          ORDER BY IdFactura DESC 
    `, [searchTerm, '%' + searchTerm + '%', '%' + searchTerm + '%']);

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

//INSERT
async function agregarFactura(tabla, Data) {
  let connection;

  try {
    connection = await getConnection(); // Obtener conexión del pool
    const [result] = await connection.query(`INSERT INTO ${tabla} (NumeroFactura, NombreProveedor, LugarCompra, FechaFactura,Observacion) VALUES (?, ?, ?, ?, ?)`,
      [Data.numeroFactura, Data.nombreProveedor, Data.lugarCompra, Data.fechaFactura, Data.observacion]);
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

/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
//*TECNICOS*/
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
/** CONSULTAS */

async function Verificar_Login(tabla, username) {
  let connection;
  try {
    connection = await getConnection(); // Obtener conexión del pool
    const [result] = await connection.query(`SELECT nombre,PasswordWeb,cargo,usuario,id_tecnico,IsAdmin FROM ${tabla} WHERE Username = ? AND status_tecnico=1
    `, [username]);
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

// Función corregida
async function Verificar_Existencia_usuario_tecnico(tabla, username) {
  let connection;
  try {
    connection = await getConnection(); // Obtener conexión del pool
    // Cambiar a SELECT completo para recuperar los datos (incluyendo el hash de la contraseña)
    const [result] = await connection.query(
      `SELECT nombre,PasswordWeb,cargo,usuario,id_tecnico,IsAdmin FROM ${tabla} WHERE usuario = ?  `,
      [username]
    );
    // Si hay resultados, devolver el primer registro (objeto con los datos)
    if (result.length > 0) {
      return result[0];  // Devuelve el objeto completo del usuario (ej: { id_tecnico: 1, usuario: 'ejemplo', password: 'hash...' })
    } else {
      return null;  // Usuario no existe
    }
  } catch (error) {
    console.error("[db error]", error);
    throw error; // Lanza el error para manejarlo más arriba
  } finally {
    if (connection) {
      connection.release(); // Libera la conexión de vuelta al pool
    }
  }
}



//INSERT
async function agregarTecnicos(tabla, Data, hashedPassword, passwordCIP) {
  let connection;

  try {
    connection = await getConnection(); // Obtener conexión del pool
    const [result] = await connection.query(`INSERT INTO ${tabla} (nombre, usuario, password, PasswordWeb,cargo,estatus_tecnico,IsAdmin) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [Data.nombre, Data.usuario, passwordCIP, hashedPassword, Data.cargo, Data.estatus_tecnico, Data.IsAdmin]);
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

/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
//*MOVIMIENTO DE COMPONENTES*/
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
//INSERT
async function agregarMovimientoComponente(tabla, componenteMovAnterior, componenteMovFinal, codigoTI,idComponente) {
  let connection;
const idtecnico=componenteMovFinal.FK_IdTecnico;
  try {
    connection = await getConnection(); // Obtener conexión del pool
    const [result] = await connection.query(`INSERT INTO ${tabla} (
        Operacion_origen, StatusComponente_origen, Observaciones_origen, NumeroSerie_origen, FK_IdUnidad_origen, FK_IdArea_origen, FK_IdCatalogoComponente_origen,
        Operacion_destino, StatusComponente_destino, Observaciones_destino, NumeroSerie_destino, FK_IdUnidad_destino, FK_IdArea_destino, FK_IdCatalogoComponente_destino,
        FK_Componente, numero_contrato, CodigoTI, StatusInventario, FechaCambio, FK_TECNICO
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)`,
      [
        componenteMovAnterior.operacion, componenteMovAnterior.status_componente, componenteMovAnterior.observaciones, componenteMovAnterior.numero_serie, componenteMovAnterior.FK_id_unidad, componenteMovAnterior.FK_id_area, componenteMovAnterior.FK_id_catalogo_componentes,
        componenteMovFinal.operacion, componenteMovFinal.status_componente, componenteMovFinal.observaciones, componenteMovFinal.numero_serie, componenteMovFinal.FK_id_unidad, componenteMovFinal.FK_id_area, componenteMovFinal.FK_id_catalogo_componentes,
        idComponente, componenteMovFinal.numero_contrato_actual, codigoTI, componenteMovFinal.status_inventario, idtecnico
      ]);
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


//consulta_TotalRetirosEnTransito
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
//*REPORTES DE RETIROS*/
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
async function consulta_TotalRetirosEnTransito(tabla) {
  let connection;
  const status_retiro='DOCUMENTO GENERADO';
  try {
    connection = await getConnection(); // Obtener conexión del pool
    const [result] = await connection.query(`SELECT COUNT(IdRetiroEquipo) AS EquiposEnTransito FROM ${tabla} WHERE status_retiro=?
    `, [status_retiro]);
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
  //CONSULTA
  consulta_NumSerie_CodigoTI,
  consulta_componente,
  Verificar_Existencia_componente,
  consulta_id_componente,
  consulta_Max_consecutivo_PorDispositivo_y_Operacion,

  //UPDATE
  EditarComponenteFactura,
  EditarComponentePorID,


  //UNIDADES
  consulta_Por_Unidad,
  //AREAS
  consulta_Area_Por_TipoUnidad,
  consulta_Todas_Areas_Por_TipoUnidad,

  //*RESPONSABLES
  consulta_ResponsablePorUnidad,
  ConsultaTodosResponsablePorIDUnidad,
  //*DISPOSITIVOS
  consulta_TODOS_dispositivos,
  consulta_Por_Dispositivo_Busqueda,

  //*CATALOGO COMPONENTES
  consulta_Catalogos_Por_Dispositivo_Busqueda,
  consulta_Todos_Catalogos_Por_Dispositivo,

  //*FACTURAS
  consulta_Todas_Facturas,
  consulta_Factura_Busqueda,

  //INSERT
  agregarFactura,

  //*LOGIN TABLA TECNICO
  Verificar_Existencia_usuario_tecnico,
  Verificar_Login,
  agregarTecnicos,


  //MOVIMIENTO DE COMPONENTES
  //INSERT
  agregarMovimientoComponente,

  //*REPORTES DE RETIROS
consulta_TotalRetirosEnTransito,
};
