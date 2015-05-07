import azure from 'azure-storage';
import queue from './queue';
import table from './table';
import blob from './blob';

module.exports = createStorageSimple;

function createStorageSimple(storageAccountOrConnectionString, storageAccountKey) {
  var account = storageAccountOrConnectionString || process.env.AZURE_STORAGE_ACCOUNT || process.env.AZURE_STORAGE_CONNECTION_STRING;
  var key = storageAccountKey || process.env.AZURE_STORAGE_ACCESS_KEY || null;
  
  return {
    createTableService: ()=>azure.createTableService(account,key),
    createQueueService: ()=>azure.createQueueService(account,key),
    createBlobService: ()=>azure.createBlobService(account,key),

    queue: (name)=>queue(account,key,name),
    table: (name)=>table(account,key,name),
    blob: (name)=>blob(account,key,name)
  }
}