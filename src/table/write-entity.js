var clone = require('safe-clone-deep')
var getTableService = require('./get-table-service');

module.exports = writeEntity;

function writeEntity(store,key,name,partitionKey,rowKey,record) {
  return getTableService(store,key,name).then(function(svc){
    return new Promise(function(resolve,reject){
      try {
        var entity = wrapEntity(partitionKey,rowKey,record);
        svc.insertOrMergeEntity(name,entity,function(err,result,response){
          if (err) {
            err.detail = {response:response};
            return reject(err);
          }
          return resolve(result);
        })
      } catch(err) {
        return reject(err)
      }
    });
  });
}

function wrapEntity(partitionKey,rowKey,record) {
  var entity = {
    PartitionKey: {_:partitionKey},
    RowKey: {_:rowKey}
  };
  for (var key in record) {
    if (!record.hasOwnProperty(key)) continue;
    entity[key] = wrapValue(record[key]);
  }
  return entity
}

function wrapValue(val) {
  // Null, NotANumber (invalid date), and undefined, use null
  if (val === null || val === NaN || typeof val === 'undefined') return {_:null};
  
  //non-objects, let azure-storage infer type
  if (typeof val !== 'object') return {_:val};

  //object types not to be stringified
  if (val instanceof Buffer) return {_:val,$:'Edm.Binary'};
  if (val instanceof Date) return {_:val,$:'Edm.DateTime'};
  
  //stringify other object instances
  return {_:JSON.stringify(clone(val))};
}