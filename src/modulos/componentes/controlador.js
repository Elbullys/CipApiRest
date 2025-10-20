const db= require('../../DB/conexion');

const TABLA= 'componentes';

function consulta_componente(){
    return db.consulta_componente(TABLA);
}


async function ctl_verificar_id_componente_QR_Num_Serie(databusqueda){
      
    const componenteExist =await db.Verificar_Existencia_componente(TABLA,databusqueda);
   
    console.log("componenteExist",componenteExist);
        
        if(componenteExist==0)//sin EXISTENCIA
           {
           
                   return { icon:"warning",error: true, message: "No se encuentra registrado"}; // Enviar respuesta de error // Imprime el mensaje de error

           }
           else if(componenteExist>=2)//DUPLICADO
           {
                   return { icon:"warning",error: true, message: "Componente Duplicado"}; // Enviar respuesta de error // Imprime el mensaje de error
           }
           else(componenteExist==1)//SI EXISTE
           {
             return { icon:"success",error: false, message: "Se encuentra registrado"}; // Enviar respuesta de éxito // Imprime el mensaje de éxito
            //return db.consulta_id_componente(TABLA, databusqueda);
           }
           

}
async function ctl_consulta_CodigoTI_Num_Serie(databusqueda){
     return db.consulta_NumSerie_CodigoTI(TABLA, databusqueda); 
}

async function ctl_consulta_Id_Componente(id_componente){
     return db.consulta_id_componente(TABLA, id_componente); 
}




module.exports = {
    ctl_consulta_CodigoTI_Num_Serie,
    consulta_componente,
    ctl_verificar_id_componente_QR_Num_Serie,
    ctl_consulta_Id_Componente
}