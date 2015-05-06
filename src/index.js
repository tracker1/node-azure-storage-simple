var azure = require('azure-storage');
var queue = require('./queue');
var table = require('./table');
var blob = require('./blob');

module.exports = createStorageSimple;

function createStorageSimple(storageAccountOrConnectionString, storageAccountKey) {
  var account = storageAccountOrConnectionString || process.env.AZURE_STORAGE_ACCOUNT || process.env.AZURE_STORAGE_CONNECTION_STRING;
  var key = storageAccountKey || process.env.AZURE_STORAGE_ACCESS_KEY || null;
  
  return {
    createTableService: function(){ return azure.createTableService(account,key); },
    createQueueService: function(){ return azure.createQueueService(account,key); },
    createBlobService: function(){ return azure.createBlobService(account,key); },

    queue:function(name){ return queue(account,key,name); },
    table:function(name){ return table(account,key,name); },
    blob:function(name){ return blob(account,key,name); }
  }
}