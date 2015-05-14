var getTableService = require('./get-table-service');

module.exports = deleteEntity;

function deleteEntity(store,key,name,partitionKey,rowKey) {
  return getTableService(store,key,name).then(function(svc){
    return new Promise(function(resolve,reject){
      var entity = {
        PartitionKey: {_:partitionKey},
        RowKey: {_:rowKey}
      };
      svc.deleteEntity(name,entity,function(err,response){
        if (err) {
          err.detail = {response:response};
          return reject(err);
        }
        return resolve(null);
      });
    });
  });
}
