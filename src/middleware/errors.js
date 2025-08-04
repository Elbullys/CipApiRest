function error (message,code) {
 let e =new error(message);
if(code){
    e.statusCode=code;  
}
return e;


}

module.exports = error;