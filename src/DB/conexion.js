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
      INNER JOIN contrato CT ON CT.id_contrato = 1
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

async function consulta_id_componente(tabla, databusqueda) {
  let connection;
  try {
    connection = await getConnection(); // Obtener conexión del pool

    const [result] = await connection.query(`
      SELECT U.id_unidad, R.nombre_responsable, U.nombre_unidad, A.area, C.operacion,
             D.tipo_equipo, M.marca, M.modelo, C.numero_serie, C.codigo_TI, C.observaciones,
             C.status_componente, C.status_inventario, CT.num_contrato_actual, T.nombre,
             C.FechaRegistro, C.EsClienteServidor, C.FechaCompra, CF.NumeroFactura,
             CF.NombreProveedor, CF.LugarCompra, CF.FechaFactura
      FROM ${tabla} C
      INNER JOIN unidad U ON U.id_unidad = C.FK_id_unidad
      INNER JOIN responsable R ON R.id_responsable = C.FK_id_responsable
      INNER JOIN catalogo_componentes CC ON CC.id_catalogo_componente = C.FK_id_catalogo_componentes
      INNER JOIN marca M ON M.id_marca = CC.FK_id_marca_cata
      INNER JOIN dispositivos D ON D.id_dispositivo = C.FK_id_dispositivo
      INNER JOIN area A ON A.id_area = R.FK_id_area
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

module.exports = {
  consulta_id_componente,
  consulta_componente,
  Verificar_Existencia_componente,
};
