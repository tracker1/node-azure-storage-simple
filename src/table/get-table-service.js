var azure = require('azure-storage');
var svcCache = {};
var nameChecked = {};

module.exports = getTableService;

function getTableService(store,key,name) {
  
  return new Promise(function(resolve,reject){
    try {
      //key for caching service instances
      var svcCacheKey = [store,key].join('/');

      //instance of azure queue service
      var svc = svcCache[svcCacheKey];
      if (!svc) {
        svc = svcCache[svcCacheKey] = azure.createTableService(store,key);
      }

      //the queue name has already been checked.
      if (nameChecked[name]) return resolve(svc);

      //check the queue name
      svc.createTableIfNotExists(name, function(err,result,response){
        if (err) {
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