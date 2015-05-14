var getTableService = require('./get-table-service');
var unwrapTableValues = require('./unwrap-table-values');

module.exports = readEntity;

function readEntity(store,key,name,partitionKey,rowKey) {
  return getTableService(store,key,name).then(function(svc){
    return new Promise(function(resolve,reject){
      svc.retrieveEntity(name,partitionKey,rowKey,function(err,result,response){
        if (err) {
          err.detail = {response:response};
          return reject(err);
        }
        return resolve(unwrapTableValues(result));
      });
    });
  });
}
