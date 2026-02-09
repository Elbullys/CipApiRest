const db= require('../../DB/conexion');

const TABLA= 'componente_factura';

/**//////////////////////////////////////////////////////////////////////////////////////////////////// */
//CONSULTAS
/**//////////////////////////////////////////////////////////////////////////////////////////////////// */
//consulta factura por medio de campo de busqueda
async function ctl_consulta_Factura_Busqueda(searchTerm){
  
           return db.consulta_Factura_Busqueda(TABLA,searchTerm);
  
}
//consulta todas las facturas select * from
async function ctl_consulta_Todas_Facturas(){
   

           return db.consulta_Todas_Facturas(TABLA);

     
}

/****************************************************************************************************** */
//INSERT
/****************************************************************************************************** */
function ctl_agregarFactura(Data){
 
    return db.agregarFactura(TABLA,Data);

}


module.exports = {
    //consultas
    ctl_consulta_Factura_Busqueda,
    ctl_consulta_Todas_Facturas,
    //INSERT
    ctl_agregarFactura

    
}