import azure from 'azure-storage';
import repromise from 'repromise';
var svcCache = {};
var nameChecked = {};

export { getBlobService as default };
export default function getBlobService(...params) {
  return repromise(()=>getBlobServicePromise(...params));
}

function getBlobServicePromise(store,key,name,options) {
  return new Promise((resolve,reject)=>{
    try {
      //key for caching service instances
      var svcCacheKey = [store,key].join('/');

      //instance of azure queue service
      var svc = svcCache[svcCacheKey];
      if (!svc) {
        svc = svcCache[svcCacheKey] = azure.createBlobService(store,key);
      }

      //the queue name has already been checked.
      if (nameChecked[name]) return resolve(svc);

      //check the queue name
      svc.createContainerIfNotExists(name, options, (err,result,response)=>{
        if (err) {
          delete svcCache[svcCacheKey];
          delete nameChecked[name];

          err.detail = {response:response};
          return reject(err);
        }
        
        nameChecked[name] = true; //checked
        return resolve(svc);
      });
    } catch(err) {
      return reject(err);
    }
  });
}
