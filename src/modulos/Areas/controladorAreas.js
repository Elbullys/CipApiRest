const db= require('../../DB/conexion');

const TABLA= 'area';


async function ctl_consulta_Area_Por_TipoUnidad(TipoUnidad,searchTerm){
     //return db.consulta_NumSerie_CodigoTI(TABLA, IdUnidad); 

     
     if(TipoUnidad==="" || TipoUnidad==null)
     {
        return { icon:"warning",error: true, message: "El campo no puede ir vacio"};  // Retorna respuesta de error
     }
     else
     {
           return db.consulta_Area_Por_TipoUnidad(TABLA, TipoUnidad,searchTerm);
      
    
     }
     
}

async function ctl_consulta_Todas_Areas_Por_TipoUnidad(TipoUnidad){
     //return db.consulta_NumSerie_CodigoTI(TABLA, IdUnidad); 

     if(TipoUnidad==="" || TipoUnidad==null)
     {
        return { icon:"warning",error: true, message: "El campo no puede ir vacio"};  // Retorna respuesta de error
     }
     else
     {
           return db.consulta_Todas_Areas_Por_TipoUnidad(TABLA, TipoUnidad);
      
    
     }
     
}

module.exports = {
    ctl_consulta_Area_Por_TipoUnidad,
    ctl_consulta_Todas_Areas_Por_TipoUnidad
    
}