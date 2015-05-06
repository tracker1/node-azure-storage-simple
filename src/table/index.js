var readEntity = require('./read-entity');
var writeEntity = require('./write-entity');
var deleteEntity = require('./delete-entity');

module.exports = function createTableWrapper(store,key,name) {
  return {
    read: function(partitionKey, rowKey){ return readEntity(store,key,name,partitionKey,rowKey); },
    write: function(partitionKey, rowKey, record){ return writeEntity(store,key,name,partitionKey,rowKey,record); },
    delete: function(partitionKey, rowKey){ return deleteEntity(store,key,name,partitionKey,rowKey); }
  };
}