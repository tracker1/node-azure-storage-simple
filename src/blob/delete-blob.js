import repromise from 'repromise';

export default function deleteBlob(...options) {
  return repromise(()=>deleteBlobPromise(...options)).catch((err)=>console.error(err.stack));
}


function deleteBlobPromise(svc,containerName,path,options) {
  return new Promise((resolve,reject)=>{
    svc.deleteBlob(containerName,path,options,(err,response)=>{
      try {
        if (err) {
          if (response && response.statusCode == 404) return resolve(null); //bury errors for 404 response
          err.detail = {response};
          return reject(err);
        }
        return resolve(null);
      }catch(err){
        return reject(err);
      }
    })
  })
}
