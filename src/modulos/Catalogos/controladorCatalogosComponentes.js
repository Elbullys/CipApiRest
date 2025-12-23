const db= require('../../DB/conexion');

const TABLA= 'catalogo_componentes';


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
     
}//ConsultaTodosCatalogosoBusqueda

async function ctl_ConsultaTodosCatalogosBusqueda(searchTerm){
   
  
       return db.ConsultaTodosCatalogosBusqueda(TABLA,searchTerm);
  
}
module.exports = {
    ctl_consulta_Catalogos_Por_Dispositivo_Busqueda,
    ctl_consulta_Todos_Catalogos_Por_Dispositivo,
    ctl_ConsultaTodosCatalogosBusqueda
    
}