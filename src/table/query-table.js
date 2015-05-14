var azure = require('azure-storage');
var getTableService = require('./get-table-service');
var unwrapTableValues = require('./unwrap-table-values');

module.exports = wrapQuery;

function wrapQuery(store,key,name) {
  var query = new azure.TableQuery();
  
  var wrapped = {
    select: (...columns)=>{
      //nothing to do ...
      if (!columns.length) return wrapped;
      
      //unwrap array ...
      if (columns.length === 1 && columns[0].length && !(columns[0] instanceof String)) columns = columns[0];
      
      query = query.select(colunms);
      return wrapped; 
    },
    top: (count)=>{
      query = query.top(count);
      return wrapped;
    },
    where: (...conditions)=>{
      query = query.where(...conditions);
      return wrapped;
    },
    next: ()=>getTableService(store,key,name).then((svc)=>runQuery(svc,name,query,null))
  }
  
  return wrapped;
}


function runQuery(service,name,query,continuationToken) {
  return new Promise((resolve,reject)=>{
    service.queryEntities(name,query,continuationToken,(err,result,response)=>{
        if (err) {
          err.detail = {response};
          return reject(err);
        };
        
        //unwrap results
        var ret = (result.entries || []).map(unwrapTableValues);
        
        //set next method, if there are more records to retrieve
        if (result.continuationToken) ret.next = ()=>runQuery(service,name,query,result.continuationToken);
        
        return resolve(ret);
    });
  });
}