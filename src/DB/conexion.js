const { getConnection } = require("./db");
const config = require("../config");

/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
    /*COMPONENTES*/
    /*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
async function consulta_componente(tabla) {
  let connection;
  try {
    connection = await getConnection(); // Obtener conexión del pool

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

async function consulta_conteo_componentes_TipoUnidad(tabla) {
  let connection;
  try {
    connection = await getConnection(); // Obtener conexión del pool
    const [result] = await connection.query(`
      SELECT A.tipo_unidad,COUNT(C.id_componente) AS Total_Componentes FROM
       ${tabla} C
      JOIN
    area A ON A.id_area = C.FK_id_area
    where C.status_inventario=1 
GROUP BY
    A.tipo_unidad 
    ORDER BY
            Total_Componentes DESC; 
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
async function consulta_conteo_componentes_ActivoBaja(tabla) {
  let connection;
  try {
    connection = await getConnection(); // Obtener conexión del pool

    const [result] = await connection.query(`
      SELECT status_inventario,COUNT(C.id_componente) AS totalcomponentes FROM
       ${tabla} C
GROUP BY
    C.status_inventario
  
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
//INVENTARIO COMPONENTES POR COLECTIVO
async function InventarioComponentesPorColectivo(BusquedaEncabezados) {

  const { id_unidad, IdResponsable, id_area, id_dispositivo, id_catalogo_componente, status_componente }
    = BusquedaEncabezados;
  console.log("BusquedaEncabezados en bd:", BusquedaEncabezados);
  let connection;
  try {
    connection = await getConnection(); // Obtener conexión del pool

    const [result] = await connection.query(`
      SELECT 'Unidad' AS Tipo, id_unidad AS ID, nombre_unidad AS Nombre FROM  unidad WHERE id_unidad = ? UNION ALL
      SELECT 'Responsable' AS Tipo, id_responsable AS ID, nombre_responsable AS Nombre FROM responsable WHERE id_responsable = ? UNION ALL
      SELECT 'Area' AS Tipo, id_area AS ID, area AS Nombre FROM area WHERE id_area = ? UNION ALL
      SELECT 'Dispositivo' AS Tipo,  id_dispositivo AS ID,  tipo_equipo AS Nombre FROM dispositivos WHERE id_dispositivo = ? UNION ALL
      SELECT 'Catalogo Componente' AS Tipo, id_catalogo_componente AS ID, nombre_catalogo AS Nombre FROM catalogo_componentes WHERE id_catalogo_componente = ?

    
    `, [id_unidad, IdResponsable, id_area, id_dispositivo, id_catalogo_componente]);

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

// INVENTARIO: Verificar existencia, duplicados y buscar coincidencias si no existe

async function verificarnumeroserieComponenteExistenciaDuplicadoArray(tabla, series) {
  if (!series || series.length === 0) return { resultados: [] };

  let connection;
  try {
    connection = await getConnection();

    // 1. Verificación exacta (agregado status_inventario)
    const queryExacta = `
      SELECT numero_serie, id_componente, status_inventario, COUNT(*) as conteo 
      FROM ?? 
      WHERE numero_serie IN (?) 
      GROUP BY numero_serie, id_componente, status_inventario`;

    const [dbRows] = await connection.query(queryExacta, [tabla, series]);

    const dbMap = new Map();
    dbRows.forEach(row => {
      const s = row.numero_serie.toString().trim();
      if (!dbMap.has(s)) {
        dbMap.set(s, { id: row.id_componente, conteo: 0, status: row.status_inventario });
      }
      dbMap.get(s).conteo += row.conteo;
    });

    const resultados = [];

    for (const serie of series) {
      const s = serie?.toString().trim();
      const data = dbMap.get(s);

      let existe = data ? data.conteo > 0 : false;
      let duplicado = data ? data.conteo > 1 : false;
      let detalles = '';

      if (duplicado) {
        detalles = `Repetido ${data.conteo} veces en sistema`;
      } else if (!existe) {
        // --- LÓGICA DE SUGERENCIAS MEJORADA ---
        // Tomamos los primeros 5 caracteres para buscar por prefijo (Caso: rendnfnd -> rendnfn)
        const prefijo = s.substring(0, 5);

        const querySimilitud = `
          SELECT numero_serie, id_componente 
          FROM ?? 
          WHERE numero_serie LIKE ? 
          LIMIT 3`;

        // Buscamos cualquier cosa que empiece igual (prefijo%) 
        const [simRows] = await connection.query(querySimilitud, [tabla, `${prefijo}%`]);

        if (simRows.length > 0) {
          // Filtramos para no mostrar la misma serie si por algo falló la exacta
          const sugerenciasFiltradas = simRows
            .filter(r => r.numero_serie !== s)
            .map(r => `${r.numero_serie} (ID:${r.id_componente})`)
            .join(' | ');

          detalles = sugerenciasFiltradas ? `Sugerencias: ${sugerenciasFiltradas}` : 'Sin coincidencias';
        } else {
          detalles = 'Sin coincidencias';
        }
      }

      // --- LÓGICA PARA STATUS_INVENTARIO ---
      // Si existe y status_inventario == 0, agregar a detalles como "BAJA"
      if (existe && data.status == 0) {
        detalles += (detalles ? ' | ' : '') + 'Status Inventario: BAJA';
      }
      // Si status_inventario == 1, no se agrega nada adicional

      resultados.push({
        serie: s,
        existe,
        duplicado,
        detalles,
        status_inventario: data ? data.status : null  // Nuevo: devolver status para que el frontend lo use
      });
    }

    return { resultados };

  } catch (error) {
    console.error("Error en verificación:", error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}



async function consultaComponentesColectivoArray(tabla, componentes) {
  let connection;
  try {
    connection = await getConnection();

    // 1. Extraemos solo los números de serie en un array simple
    const series = componentes.componentes.map(comp => comp.serie);

    if (series.length === 0) return { results: [] };

    // 2. Hacemos UNA SOLA consulta para todas las series
    // El query usa IN (?) que acepta un array de valores
    const [results] = await connection.query(`
      SELECT 
        operacion, status_componente, observaciones,
        numero_serie, FK_id_unidad, FK_id_area, FK_id_catalogo_componentes,
         CT.num_contrato_actual, codigo_TI, id_componente, status_inventario
      FROM ?? 
       INNER JOIN contrato CT ON CT.id_contrato = (
          SELECT MAX(id_contrato) FROM contrato
      )
      WHERE numero_serie IN (?)
    `, [tabla, series]);

    // Importante: mysql2 devuelve los resultados directamente en un array
    return { results };

  } catch (error) {
    console.error("[db error]", error);
    throw new Error(`Error en la Consulta: ${error.message}`);
  } finally {
    if (connection) connection.release();
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
  console.log("data en bd", data);
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
      FK_id_dispositivo = ?, FK_id_catalogo_componentes = ?,FK_id_area = ?, 
      FK_IdTecnico = ? , EsClienteServidor = ?, FechaCompra = ? 
      WHERE id_componente = ?
    `, [FK_Factura, operacion, numero_serie, estado_equipo, numero_consecutivo,
      codigo_TI, observaciones, status_componente, status_inventario,
      FK_id_responsable, FK_id_unidad, FK_id_dispositivo, FK_id_catalogo_componentes,
      FK_id_area, FK_IdTecnico, EsClienteServidor, FechaCompra, idComponente]);
    return { result, codigo_TI }; // Retorna el resultado de la consulta
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

async function actualizarComponentesColectivo(tabla, componentes) {
  let connection;
  try {
    connection = await getConnection();

    // Para batch updates, usa un loop (cada UPDATE es individual)
    const results = [];
    for (const comp of componentes) {
      const [result] = await connection.query(`
        UPDATE ??
        SET 
            observaciones = ?,
            status_componente = ?,
            FK_id_responsable = ?,
            FK_id_unidad = ?,
            FK_id_catalogo_componentes = ?,
            FK_id_area = ?
        WHERE numero_serie = ? 
      `, [
        tabla,
        comp.observacion || 'SO',
        comp.status_componente,
        comp.id_responsable,
        comp.id_unidad,
        comp.id_catalogo_componentes,
        comp.id_area,
        comp.serie  // WHERE por serie
      ]);
      results.push(result);
    }

    return { results, updatedCount: results.length };
  } catch (error) {
    console.error("[db error]", error);
    throw new Error(`Error en actualización: ${error.message}`);
  } finally {
    if (connection) {
      connection.release();
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
      SELECT R.id_responsable ,R.nombre_responsable,R.login,R.cargo,U.nombre_unidad,R.estado_responsable,R.FK_idunidad,R.FK_id_area ,A.area
      FROM ${tabla} R JOIN unidad U ON U.id_unidad=R.FK_idunidad JOIN area AS A ON A.id_area=R.FK_id_area 
      WHERE  R.FK_idunidad = ? AND R.nombre_responsable LIKE ?  AND R.estado_responsable = 'ACTIVO' 
    `, [idUnidad, '%' + searchTerm + '%']);

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
async function consulta_Por_ResponsableGlobalPorUnidad(tabla, searchTerm, idUnidad) {

  let connection;
  try {
    connection = await getConnection(); // Obtener conexión del pool
    const [result] = await connection.query(`
      SELECT R.id_responsable ,R.nombre_responsable,R.login,R.cargo,U.nombre_unidad,R.estado_responsable,R.FK_idunidad,R.FK_id_area ,A.area
      FROM ${tabla} R JOIN unidad U ON U.id_unidad=R.FK_idunidad JOIN area AS A ON A.id_area=R.FK_id_area 
      WHERE  R.FK_idunidad = ? AND R.nombre_responsable LIKE ?
    `, [idUnidad, '%' + searchTerm + '%']);

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
async function consulta_consultaResponsablesGlobalPorUnidad(tabla, idUnidad) {

  let connection;
  try {
    connection = await getConnection(); // Obtener conexión del pool
    const [result] = await connection.query(`
      SELECT R.id_responsable ,R.nombre_responsable,R.login,R.cargo,U.nombre_unidad,R.estado_responsable,R.FK_idunidad,R.FK_id_area ,A.area
      FROM ?? R JOIN unidad U ON U.id_unidad=R.FK_idunidad JOIN area AS A ON A.id_area=R.FK_id_area 
      WHERE  R.FK_idunidad = ? 
    `, [tabla,idUnidad]);

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
async function consulta_ResponsablePorIdResponsable(tabla, idResponsable) {

  let connection;
  try {
    connection = await getConnection(); // Obtener conexión del pool
    const [result] = await connection.query(`
      SELECT R.id_responsable ,R.nombre_responsable,R.login,R.cargo,U.nombre_unidad,U.tipo_unidad,R.estado_responsable,R.FK_idunidad,R.FK_id_area ,A.area
      FROM ?? R JOIN unidad U ON U.id_unidad=R.FK_idunidad JOIN area AS A ON A.id_area=R.FK_id_area 
      
      WHERE  R.id_responsable = ? 
    `, [tabla, idResponsable]);

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
async function Verificar_Duplicidad_usuario_responsable(tabla, username,IDUnidad) {
  let connection;
  try {
    connection = await getConnection(); // Obtener conexión del pool
    // Cambiar a SELECT completo para recuperar los datos (incluyendo el hash de la contraseña)
    const [result] = await connection.query(
      `SELECT nombre_responsable,password,PasswordWeb,cargo,login,id_responsable,estado_responsable FROM ?? WHERE login = ? AND FK_idunidad= ? `,
      [tabla, username,IDUnidad]
    );
    // Si hay resultados, devolver el primer registro (objeto con los datos)
    if (result.length > 0) {

      return true;  // Devuelve el objeto completo del usuario (ej: { id_tecnico: 1, usuario: 'ejemplo', password: 'hash...' })
    } else {
      return false;  // Usuario no existe
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
//PERMITE REALIZAR EL MUESTREO DE TODAS LOS RESPONSABLES EXISTENTES DONDE COINCIDA EL ID DE UNIDAD
async function ConsultaTodosResponsablePorIDUnidad(tabla, idUnidad) {

  let connection;
  try {
    connection = await getConnection(); // Obtener conexión del pool

    const [result] = await connection.query(`
      SELECT R.id_responsable ,R.nombre_responsable,R.login,R.cargo,U.nombre_unidad,R.estado_responsable,R.FK_idunidad,R.FK_id_area,A.area 
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

//INSERT
async function agregarResponsable(tabla, Data, hashedPassword, passwordCIP) {
  let connection;

  try {
    connection = await getConnection(); // Obtener conexión del pool
    const [result] = await connection.query(`INSERT INTO ?? (nombre_responsable, login, password, PasswordWeb,cargo,estado_responsable,FK_idunidad,FK_id_area) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [tabla, Data.nombre_responsable, Data.login, passwordCIP, hashedPassword, Data.cargo, Data.estado_responsable, Data.FK_idunidad, Data.FK_id_area]);
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

async function EditarResponsablePorIDConPassword(tabla, id_responsable, dataResponsable, hashedPassword, passwordCIP) {
  let connection;
  console.log("data en bd", dataResponsable);
  try {
    const {
      nombre_responsable, login, password, cargo, estado_responsable, FK_idunidad, FK_id_area

    } = dataResponsable;


    connection = await getConnection(); // Obtener conexión del pool
    const [result] = await connection.query(`
      UPDATE ??
      SET nombre_responsable= ?,login= ?,password = ?,PasswordWeb = ?, cargo = ?,
      estado_responsable = ?,FK_idunidad = ?,FK_id_area = ?
      WHERE id_responsable = ?
    `, [tabla,nombre_responsable, login, passwordCIP, hashedPassword, cargo, estado_responsable, FK_idunidad, FK_id_area, id_responsable]);
    return { result, login }; // Retorna el resultado de la consulta
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

async function EditarResponsablePorIDSinPassword(tabla, id_responsable, dataResponsable) {
  let connection;
  console.log("data en bd", dataResponsable);
  try {
    const {
      nombre_responsable, login, cargo, estado_responsable, FK_idunidad, FK_id_area

    } = dataResponsable;


    connection = await getConnection(); // Obtener conexión del pool
    const [result] = await connection.query(`
      UPDATE ??
      SET nombre_responsable= ?,login= ?, cargo = ?,
      estado_responsable = ?,FK_idunidad = ?,FK_id_area = ?
      WHERE id_responsable = ?
    `, [tabla,nombre_responsable, login, cargo, estado_responsable, FK_idunidad, FK_id_area, id_responsable]);
    return { result, login }; // Retorna el resultado de la consulta
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
//*MARCA/MODELO*/
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
async function consulta_Por_MarcaModelo_BusquedaPorDispositivo(tabla, searchTerm,FK_dispositivo) {

  let connection;
  try {
    connection = await getConnection(); // Obtener conexión del pool

    const [result] = await connection.query(`
      SELECT id_marca,marca,modelo,FK_id_dispositivo,D.tipo_equipo 
      FROM ?? M 
      INNER JOIN dispositivos D ON D.id_dispositivo=M.FK_id_dispositivo
      WHERE M.FK_id_dispositivo = ? 
       AND (M.marca LIKE ? OR M.modelo LIKE ? ) ORDER BY tipo_equipo ASC
    `, [tabla,FK_dispositivo,'%' + searchTerm + '%','%' + searchTerm + '%']);

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
//ConsultaCatalogoPorID
async function ConsultaCatalogoPorID(tabla,Id_catalogo_componente ){

  let connection;
  try {
    connection = await getConnection(); // Obtener conexión del pool

    const [result] = await connection.query(`
      select CC.id_catalogo_componente, CC.nombre_catalogo,CC.descripcion_modelo,D.tipo_equipo,D.CaracteristicasAdicionales,
      CC.FK_id_dispositivo, CC.FK_id_marca_cata,CC.FK_catalogo_caracteristicas,CCC.ProcesadorID,CCC.MemoriaRamID,
      CCC.DiscoDuroID,CCC.SistemaOperativoID,
       M.marca, M.modelo,CONCAT( CP.Fabricante,' ',CP.serie,' ',CP.modelo) AS 'Procesador',
       CONCAT (CMR.CapacidadGB,' ',CMR.Tipo) AS 'Memoria Ram',CONCAT(CDD.Tipo,' ',CDD.Capacidad_GB)
        AS 'Disco Duro', CONCAT (CSO.Nombre,' ',CSO.VersIon_SO,' ',CSO.Arquitectura) AS 'Sistema Operativo'
         FROM ?? AS CC JOIN dispositivos AS D ON CC.FK_id_dispositivo=D.id_dispositivo  JOIN marca AS M 
         ON CC.FK_id_marca_cata=M.id_marca JOIN catalogo_componente_caracteristicas AS CCC 
         ON CCC.id_catalogo_caract=CC.FK_catalogo_caracteristicas JOIN Cat_sistema_operativo 
         AS CSO ON CSO.IdSistemaOperativo=CCC.SistemaOperativoID JOIN Cat_procesador AS CP 
         ON CP.IdProcesador=CCC.ProcesadorID JOIN Cat_memoria_ram AS CMR ON 
         CMR.IdMemoriaRam=CCC.MemoriaRamID JOIN Cat_disco_duro AS CDD ON CDD.IdDiscoDuro=CCC.DiscoDuroID
          WHERE CC.id_catalogo_componente= ?
          ORDER BY CC.nombre_catalogo ASC
    `, [tabla, Id_catalogo_componente ]);

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
//PERMITE REALIZAR EL MUESTREO DE TODOS LOS CATALOGOS EXISTENTES CON BUSQUEDA
async function ConsultaTodosCatalogosBusqueda(tabla, searchTerm) {

  let connection;
  try {
    connection = await getConnection(); // Obtener conexión del pool

    const [result] = await connection.query(`
      select CC.id_catalogo_componente, CC.nombre_catalogo,CC.descripcion_modelo,D.tipo_equipo,CC.FK_catalogo_caracteristicas, D.tipo_equipo,
       M.marca, M.modelo,CONCAT( CP.Fabricante,' ',CP.serie,' ',CP.modelo) AS 'Procesador',
       CONCAT (CMR.CapacidadGB,' ',CMR.Tipo) AS 'Memoria Ram',CONCAT(CDD.Tipo,' ',CDD.Capacidad_GB)
        AS 'Disco Duro', CONCAT (CSO.Nombre,' ',CSO.VersIon_SO,' ',CSO.Arquitectura) AS 'Sistema Operativo'
         FROM ${tabla} AS CC JOIN dispositivos AS D ON CC.FK_id_dispositivo=D.id_dispositivo  JOIN marca AS M 
         ON CC.FK_id_marca_cata=M.id_marca JOIN catalogo_componente_caracteristicas AS CCC 
         ON CCC.id_catalogo_caract=CC.FK_catalogo_caracteristicas JOIN Cat_sistema_operativo 
         AS CSO ON CSO.IdSistemaOperativo=CCC.SistemaOperativoID JOIN Cat_procesador AS CP 
         ON CP.IdProcesador=CCC.ProcesadorID JOIN Cat_memoria_ram AS CMR ON 
         CMR.IdMemoriaRam=CCC.MemoriaRamID JOIN Cat_disco_duro AS CDD ON CDD.IdDiscoDuro=CCC.DiscoDuroID
          WHERE (D.tipo_equipo LIKE ? OR CC.nombre_catalogo LIKE ? OR M.marca LIKE ? OR M.modelo LIKE ?)
          ORDER BY CC.nombre_catalogo ASC
    `, ['%' + searchTerm + '%','%' + searchTerm + '%', '%' + searchTerm + '%', '%' + searchTerm + '%']);

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
async function InsertaryVerificarCatalogoComponente( Data) {
  let connection;

  const { nombre_catalogo, descripcion_modelo, FK_id_dispositivo,
     nombre_marca,nombre_modelo, id_procesador,id_memoriaram,
     id_discoduro,FK_id_marca_cata,id_sistema_operativo,
     CaracteristicasAdicionales,BanderaAutorizacionInsercion,
     } = Data;

  try {
     connection = await getConnection(); // Obtener conexión del pool
    await connection.query(`CALL SP_INSERTAR_Y_VERIFICAR_CATALOGO
      (? ,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?,@resultado,@existeMarcaModelo,@Id_Catalogo_Insert )
    `, [nombre_catalogo, descripcion_modelo, FK_id_dispositivo,
      nombre_marca,nombre_modelo, id_procesador,id_memoriaram,
      id_discoduro,FK_id_marca_cata,id_sistema_operativo,
      CaracteristicasAdicionales,BanderaAutorizacionInsercion],
    );
    // Obtener los valores OUT con una SELECT
    const [rows] = await connection.query(
      'SELECT @resultado AS resultado, @existeMarcaModelo AS existeMarcaModelo , @Id_Catalogo_Insert AS Id_Catalogo_Insert'
    );

    // Retornar los resultados
    return {
      resultado: rows[0].resultado,  // 1 o 0
      existeMarcaModelo: rows[0].existeMarcaModelo,  // 1 o 0
      Id_Catalogo_Insert: rows[0].Id_Catalogo_Insert  //ID CATALOGO COMPONENTES CREADO
    };
    
  } catch (error) {
    console.error("[db error]", error);
    throw error; // Lanza el error para manejarlo más arriba
  } finally {
    if (connection) {
      connection.release(); // Libera la conexión de vuelta al pool
    }
  }
}

//UPDATE 

async function EditarCatalogoComponentesPorId(tabla, dataCatalogoComponente, id_catalogo_componente) {
  let connection;
  
  try {
    const {
      nombre_catalogo, descripcion_modelo, FK_id_dispositivo , FK_id_marca_cata , FK_catalogo_caracteristicas

    } = dataCatalogoComponente;


    connection = await getConnection(); // Obtener conexión del pool
    const [result] = await connection.query(`
      UPDATE ??
      SET nombre_catalogo= ?,descripcion_modelo = ?,FK_id_dispositivo = ?, FK_id_marca_cata = ?, FK_catalogo_caracteristicas = ?
      WHERE id_catalogo_componente = ?
    `, [tabla,nombre_catalogo, descripcion_modelo, FK_id_dispositivo , FK_id_marca_cata , FK_catalogo_caracteristicas, id_catalogo_componente]);
    return { result, id_catalogo_componente }; // Retorna el resultado de la consulta
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
//*Procesador*/
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
async function consulta_Todos_Procesador_busqueda(tabla, searchTerm) {

  let connection;
  try {
    connection = await getConnection(); // Obtener conexión del pool

    const [result] = await connection.query(`
      select IdProcesador,Fabricante,serie,modelo from  ?? 
          WHERE (Fabricante LIKE ? OR serie LIKE ? OR modelo LIKE ?)
          ORDER BY Fabricante ASC,serie ASC
    `, [tabla,'%' + searchTerm + '%','%' + searchTerm + '%', '%' + searchTerm + '%']);

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
//*MEMORIA RAM*/
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
async function consulta_Todos_MemoriaRam_busqueda(tabla, searchTerm) {

  let connection;
  try {
    connection = await getConnection(); // Obtener conexión del pool

    const [result] = await connection.query(`
      select IdMemoriaRam ,CapacidadGB,Tipo from  ?? 
          WHERE (CapacidadGB LIKE ? OR Tipo LIKE ?)
          ORDER BY Tipo ASC
    `, [tabla,'%' + searchTerm + '%', '%' + searchTerm + '%']);

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
//*ALMACENAMIENTO (DISCO DURO)*/ consulta_Todos_SistemaOperativo_busqueda
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
async function consulta_Todos_DiscoDuro_busqueda(tabla, searchTerm) {

  let connection;
  try {
    connection = await getConnection(); // Obtener conexión del pool

    const [result] = await connection.query(`
      select IdDiscoDuro,Tipo,Capacidad_GB from  ?? 
          WHERE (Tipo LIKE ? OR Capacidad_GB LIKE ?)
          ORDER BY Tipo ASC
    `, [tabla,'%' + searchTerm + '%', '%' + searchTerm + '%']);

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
//*SISTEMA OPERATIVO*/ 
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
async function consulta_Todos_SistemaOperativo_busqueda(tabla, searchTerm) {

  let connection;
  try {
    connection = await getConnection(); // Obtener conexión del pool

    const [result] = await connection.query(`
      select IdSistemaOperativo ,Nombre,VersIon_SO,Arquitectura from  ?? 
          WHERE (Nombre LIKE ? OR VersIon_SO LIKE ? OR Arquitectura LIKE ?)
          ORDER BY Nombre  ASC
    `, [tabla,'%' + searchTerm + '%', '%' + searchTerm + '%','%' + searchTerm + '%']);

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

async function Verificar_Duplicidad_usuario_tecnico(tabla, username) {
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

      return true;  // Devuelve el objeto completo del usuario (ej: { id_tecnico: 1, usuario: 'ejemplo', password: 'hash...' })
    } else {
      return false;  // Usuario no existe
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

async function Consulta_Todos_Tecnicos(tabla, searchTerm) {
  let connection;
  try {
    connection = await getConnection(); // Obtener conexión del pool
    // Cambiar a SELECT completo para recuperar los datos (incluyendo el hash de la contraseña)
    const [result] = await connection.query(
      `SELECT id_tecnico, nombre,cargo,usuario,estatus_tecnico,IsAdmin FROM ${tabla}
      WHERE nombre LIKE ? OR cargo LIKE ? OR usuario LIKE ? ORDER BY estatus_tecnico DESC`,
      ['%' + searchTerm + '%', '%' + searchTerm + '%', '%' + searchTerm + '%']
    );
    // Si hay resultados, devolver el primer registro (objeto con los datos)
    return result;
  } catch (error) {
    console.error("[db error]", error);
    throw error; // Lanza el error para manejarlo más arriba
  } finally {
    if (connection) {
      connection.release(); // Libera la conexión de vuelta al pool
    }
  }
}
async function Consulta_Por_Tecnico(tabla, id_tecnico) {
  let connection;
  try {
    connection = await getConnection(); // Obtener conexión del pool
    // Cambiar a SELECT completo para recuperar los datos (incluyendo el hash de la contraseña)
    const [result] = await connection.query(
      `SELECT id_tecnico, nombre,cargo,usuario,estatus_tecnico,IsAdmin FROM ${tabla}
      WHERE id_tecnico= ?`,
      [id_tecnico]
    );
    // Si hay resultados, devolver el primer registro (objeto con los datos)
    return result;
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

//UPDATE 

async function EditartecnicoPorIDConPassword(tabla, id_tecnico, dataTecnico, hashedPassword, passwordCIP) {
  let connection;
  console.log("data en bd", dataTecnico);
  try {
    const {
      nombre, usuario, password, cargo, estatus_tecnico, IsAdmin

    } = dataTecnico;


    connection = await getConnection(); // Obtener conexión del pool
    const [result] = await connection.query(`
      UPDATE ${tabla} 
      SET nombre= ?,usuario= ?,password = ?,PasswordWeb = ?, cargo = ?,
      estatus_tecnico = ?,IsAdmin = ?
      WHERE id_tecnico = ?
    `, [nombre, usuario, passwordCIP, hashedPassword, cargo, estatus_tecnico,
      IsAdmin, id_tecnico]);
    return { result, usuario }; // Retorna el resultado de la consulta
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

async function EditartecnicoPorIDSinPassword(tabla, id_tecnico, dataTecnico) {
  let connection;
  console.log("data en bd", dataTecnico);
  try {
    const {
      nombre, usuario, cargo, estatus_tecnico, IsAdmin

    } = dataTecnico;


    connection = await getConnection(); // Obtener conexión del pool
    const [result] = await connection.query(`
      UPDATE ${tabla} 
      SET nombre= ?,usuario= ?, cargo = ?,
      estatus_tecnico = ?,IsAdmin = ?
      WHERE id_tecnico = ?
    `, [nombre, usuario, cargo, estatus_tecnico,
      IsAdmin, id_tecnico]);
    return { result, usuario }; // Retorna el resultado de la consulta
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
//*MOVIMIENTO DE COMPONENTES*/
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
//INSERT
async function agregarMovimientoComponente(tabla, componenteMovAnterior, componenteMovFinal, codigoTI, idComponente) {
  let connection;
  const idtecnico = componenteMovFinal.FK_IdTecnico;
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

async function AgregarMovimientoColectivoComponenteArray(tablaMovimientos, tablaComponentes, datosExcel, componentesBD) {
  let connection;

  // Extraemos los arreglos de los objetos contenedores
  const listaFinal = datosExcel.componentes || [];
  const listaAnterior = componentesBD.results || [];

  // El ID del técnico viene dentro de los objetos del excel (asumimos el del primero)
  const idTecnico = listaFinal.length > 0 ? listaFinal[0].id_tecnico : null;
  try {
    connection = await getConnection();
    // PASO 1: Iniciar Transacción
    await connection.beginTransaction();
    // OPTIMIZACIÓN: Creamos un Mapa del Excel para buscar por serie rápidamente
    // Esto permite que el bucle sepa qué datos nuevos corresponden a cada registro viejo
    const mapaExcel = new Map(listaFinal.map(item => [item.serie, item]));
    const resultadosProcesados = [];
    for (const anterior of listaAnterior) {
      // Buscamos en el Mapa los datos nuevos usando la serie de la BD
      const itemNuevo = mapaExcel.get(anterior.numero_serie);
      // Si la serie existe en la BD pero no venía en el Excel procesado, saltamos
      if (!itemNuevo) continue;


      // 1. REGISTRAR HISTORIAL (MOVIMIENTO)
      // Se guardan los datos que TENÍA antes (origen) y los que TENDRÁ ahora (destino)
      const queryMovimiento = `
                INSERT INTO ?? (
                    Operacion_origen, StatusComponente_origen, Observaciones_origen, NumeroSerie_origen, 
                    FK_IdUnidad_origen, FK_IdArea_origen, FK_IdCatalogoComponente_origen,
                    Operacion_destino, StatusComponente_destino, Observaciones_destino, NumeroSerie_destino, 
                    FK_IdUnidad_destino, FK_IdArea_destino, FK_IdCatalogoComponente_destino,
                    FK_Componente,numero_contrato ,CodigoTI,StatusInventario, FechaCambio, FK_TECNICO
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)`;

      const paramsMovimiento = [
        tablaMovimientos,
        anterior.operacion, anterior.status_componente, anterior.observaciones, anterior.numero_serie,
        anterior.FK_id_unidad, anterior.FK_id_area, anterior.FK_id_catalogo_componentes,
        anterior.operacion, itemNuevo.status_componente, itemNuevo.observacion, itemNuevo.serie,
        itemNuevo.id_unidad, itemNuevo.id_area, itemNuevo.id_catalogo_componentes,
        anterior.id_componente, anterior.num_contrato_actual, anterior.codigo_TI, anterior.status_inventario, idTecnico
      ];

      await connection.query(queryMovimiento, paramsMovimiento);

   // 2. UPDATE COMPONENTE
            const queryUpdate = `
                UPDATE ?? SET 
                    FK_id_unidad = ?, 
                    FK_id_area = ?, 
                    status_componente = ?, 
                    observaciones = ?,
                    FK_id_catalogo_componentes = ?,
                    FK_id_responsable = ?
                WHERE id_componente = ?`;

            const paramsUpdate = [
                tablaComponentes,
                itemNuevo.id_unidad, 
                itemNuevo.id_area, 
                itemNuevo.status_componente, 
                itemNuevo.observacion,
                itemNuevo.id_catalogo_componentes,
                itemNuevo.id_responsable, 
                anterior.id_componente
            ];

            await connection.query(queryUpdate, paramsUpdate);
            // 3. AGREGAR AL ARREGLO DE RESULTADOS
            // Guardamos un objeto simple que confirme qué se actualizó
            resultadosProcesados.push({
                id_componente: anterior.id_componente,
                serie: anterior.numero_serie,
                status: 'Actualizado'
            });
    }

    // PASO 4: Si todo salió bien, confirmamos cambios
    await connection.commit();
   
    return { 
            message: "Se Actualizaron "+resultadosProcesados.length + " Registros", 
            updatedCount: resultadosProcesados.length 
        };

  } catch (error) {
    // PASO 5: Si algo falló, deshacemos TODO
    if (connection) await connection.rollback();
    console.error("[db transaction error]", error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

async function consulta_Conteo_MovimientosPorDia(tabla) {
  let connection;

  try {
    connection = await getConnection(); // Obtener conexión del pool
    const [result] = await connection.query(`SELECT COUNT(IdMovimiento) AS ConteoMovimientoPorDia 
FROM ${tabla} 
WHERE DATE(FechaCambio) = CURDATE()`);
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
  const status_retiro = 'DOCUMENTO GENERADO';
  const status_reporte = 1;
  try {
    connection = await getConnection(); // Obtener conexión del pool
    const [result] = await connection.query(`SELECT COUNT(IdRetiroEquipo) AS EquiposEnTransito FROM ${tabla} WHERE status_retiro=? AND status_reporte= ? 
    `, [status_retiro, status_reporte]);
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
//*REPORTES MANTENIMIENTO CORRECTIVO*/
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
async function consulta_Conteo_MantenimientoCorrectivo(tabla) {
  let connection;
  const status_reporte_correctivo = 1;
  try {
    connection = await getConnection(); // Obtener conexión del pool
    const [result] = await connection.query(`SELECT COUNT(id_reporte_correctivo) AS ConteoTotalMantCorrectivo FROM ${tabla} WHERE status_reporte_correctivo=? 
    `, [status_reporte_correctivo]);
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
//*REPORTES MANTENIMIENTO PREVENTIVO*/
/*//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */
async function consulta_Conteo_MantenimientoPreventivo(tabla) {
  let connection;
  const status_reporte_preventivo = 1;
  try {
    connection = await getConnection(); // Obtener conexión del pool
    const [result] = await connection.query(`SELECT COUNT(id_reporte_preventivo) AS ConteoTotalMantPreventivo FROM ${tabla} WHERE status_reporte_preventivo=? 
    `, [status_reporte_preventivo]);
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
  //*COMPONENTES
  //CONSULTA
  consulta_NumSerie_CodigoTI,
  consulta_componente,
  Verificar_Existencia_componente,
  consulta_id_componente,
  consulta_Max_consecutivo_PorDispositivo_y_Operacion,
  consulta_conteo_componentes_TipoUnidad,
  consulta_conteo_componentes_ActivoBaja,
  InventarioComponentesPorColectivo,
  verificarnumeroserieComponenteExistenciaDuplicadoArray,
  consultaComponentesColectivoArray,
  //UPDATE
  EditarComponenteFactura,
  EditarComponentePorID,
  actualizarComponentesColectivo,


  //*UNIDADES
  consulta_Por_Unidad,
  //*AREAS
  consulta_Area_Por_TipoUnidad,
  consulta_Todas_Areas_Por_TipoUnidad,

  //*RESPONSABLES
  //consults
  consulta_ResponsablePorUnidad,
  consulta_Por_ResponsableGlobalPorUnidad,
  consulta_consultaResponsablesGlobalPorUnidad,
  ConsultaTodosResponsablePorIDUnidad,
Verificar_Duplicidad_usuario_responsable,
consulta_ResponsablePorIdResponsable,
//insert
agregarResponsable,
//update
EditarResponsablePorIDSinPassword,
EditarResponsablePorIDConPassword,
  
  //*DISPOSITIVOS
  consulta_TODOS_dispositivos,
  consulta_Por_Dispositivo_Busqueda,

  //*MARCA/MODELO
  consulta_Por_MarcaModelo_BusquedaPorDispositivo,


  //*PROCESADOR //consulta_Todos_DiscoDuro_busqueda
  consulta_Todos_Procesador_busqueda,

    //*MEMORIA RAM 
  consulta_Todos_MemoriaRam_busqueda,

 //*ALMACENAMIENTO (DISCO DURO) 
  consulta_Todos_DiscoDuro_busqueda,
   //*SISTEMA OPERATIVO
  consulta_Todos_SistemaOperativo_busqueda,
  //*CATALOGO COMPONENTES
  //CONSULTA
  consulta_Catalogos_Por_Dispositivo_Busqueda,
  consulta_Todos_Catalogos_Por_Dispositivo,
  ConsultaTodosCatalogosBusqueda,
  ConsultaCatalogoPorID,
  //INSERT
  InsertaryVerificarCatalogoComponente,

  //UPDATE
  EditarCatalogoComponentesPorId,

  //*FACTURAS
  consulta_Todas_Facturas,
  consulta_Factura_Busqueda,

  //INSERT
  agregarFactura,

  //*LOGIN TABLA TECNICO
  Verificar_Existencia_usuario_tecnico,
  Verificar_Login,
  agregarTecnicos,
  Verificar_Duplicidad_usuario_tecnico,
  //CONSULTA
  Consulta_Todos_Tecnicos,
  Consulta_Por_Tecnico,
  //EDITAR
  EditartecnicoPorIDConPassword,
  EditartecnicoPorIDSinPassword,


  //*MOVIMIENTO DE COMPONENTES
  //INSERT
  agregarMovimientoComponente,
  AgregarMovimientoColectivoComponenteArray,
  //CONSULTA
  consulta_Conteo_MovimientosPorDia,

  //*REPORTES DE RETIROS
  consulta_TotalRetirosEnTransito,

  //*REPORTES MANTENIMIENTO CORRECTIVO
  consulta_Conteo_MantenimientoCorrectivo,
  //*REPORTES MANTENIMIENTO PREVENTIVO
  consulta_Conteo_MantenimientoPreventivo,

};
