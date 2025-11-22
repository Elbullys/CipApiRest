const db= require('../../DB/conexion');

const TABLA= 'responsable';


async function ctl_consulta_ResponsablePorUnidad(idUnidad,searchTerm){
     //return db.consulta_NumSerie_CodigoTI(TABLA, IdUnidad); 

     
     if(idUnidad==="" || idUnidad==null)
     {
        return { icon:"warning",error: true, message: "El campo no puede ir vacio"};  // Retorna respuesta de error
     }
     else
     {
           return db.consulta_ResponsablePorUnidad(TABLA, searchTerm,idUnidad);
      
    
     }
     
}

async function ctl_ConsultaTodosResponsablePorIDUnidad(id_unidad){
     //return db.consulta_NumSerie_CodigoTI(TABLA, IdUnidad); 

     if(id_unidad==="" || id_unidad==null)
     {
        return { icon:"warning",error: true, message: "El campo no puede ir vacio"};  // Retorna respuesta de error
     }
     else
     {
           return db.ConsultaTodosResponsablePorIDUnidad(TABLA, id_unidad);
      
    
     }
     
}



module.exports = {
    ctl_consulta_ResponsablePorUnidad,
    ctl_ConsultaTodosResponsablePorIDUnidad,
    
}