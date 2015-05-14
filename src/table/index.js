var readEntity = require('./read-entity');
var writeEntity = require('./write-entity');
var deleteEntity = require('./delete-entity');
var queryTable = require('./query-table');

module.exports = function createTableWrapper(store,key,name) {
  return {
    read: (partitionKey, rowKey)=>readEntity(store,key,name,partitionKey,rowKey),
    write: (partitionKey, rowKey, record)=>writeEntity(store,key,name,partitionKey,rowKey,record),
    delete: (partitionKey, rowKey)=>deleteEntity(store,key,name,partitionKey,rowKey),
    query: ()=>queryTable(store,key,name)
  };
}