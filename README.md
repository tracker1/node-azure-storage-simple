# node-azure-storage-simple

Simplified interfaces for Azure Storage (Tables, Queues, Blob)

This is an opinionated interface using Promises.  You can use the promises interface's `.then` and `.catch` methods, or you can use ES7-style `await` syntax via [BabelJS](http://babeljs.io/) stage 0 support, or something similar.  A global `Promise` implementation is required, and must be set globally, no searches will be done.


## Install

```js
npm install --save azure-storage-simple
```

## Module Interface - Storage

The module exposes a method that will return a Storage interface.

```js
// Use Defaults
var storage = require('azure-storage-simple')(/*no arguments, uses defaults*/); //no await


// Pass Options - the example below actually uses the default values from the environment
var account = process.env.AZURE_STORAGE_ACCOUNT;
var key = process.env.AZURE_STORAGE_ACCESS_KEY;
var cs = process.env.AZURE_STORAGE_CONNECTION_STRING;

var storage = require('azure-storage-simple')(account || cs, key || null);
```


## Underlying services

Because this module exposes only a simplified interface, the azure services interfaces are available.

**NOTE:** Will use underlying `storage` object's authentication credentials, no need to pass them in.

```js
//you will be able to access the underlying azure-storage module
var azure = require('azure-storage-simple/azure-storage'); //returns underlying azure-storage module

//the methods below will return services using the credentials for the storage object
var tableService = storage.createTableService();
var queueService = storage.createQueueService();
var blobService = storage.createBlobService();
```

For details on how to use these services see:

* [azure-storage](https://www.npmjs.com/package/azure-storage) module in npm
* [How to use Queue storage from Node.js](http://azure.microsoft.com/en-us/documentation/articles/storage-nodejs-how-to-use-queues/)
* [How to use Table storage from Node.js](http://azure.microsoft.com/en-us/documentation/articles/storage-nodejs-how-to-use-table-storage/)
* [How to Use Blob storage from Node.js](http://azure.microsoft.com/en-us/documentation/articles/storage-nodejs-how-to-use-blob-storage/)


## Azure Queues

A dramatically simplified interface for using Azure Storage Queues.

```js
var q = await service.queue('myQueueName'); //calls createQueueIfNotExist under the covers (once)

await queue.add(value);

var message = await q.one(); //gets a message

// message is wrapped with:
//    .value - parsed value  
//    other properties are buried in the prototype chain
var value2 = message.value; //unwrap the value

// got message/value - 30 seconds to resolve it

await q.done(message); //marke as complete / resolve / remove from queue
```


## Azure Tables

A simplified interface will be used to access table storage.  You won't need to wrap your objects, but you will need to specify the partitionKey and rowKey for read and write.

Note: write will do an insertOrMerge, so if you intend to remove field values, set them to null.

```js
var tbl = await storage.table('myTableName'); //calls createTableIfNotExist under the covers (once)

var value = {
  'someString': 'value',
  'someNumber': 1234,
  'someDate': new Date(),
  'someObject': {}, //will be JSON.stringified
  'someArray': [], //will be JSON.stringified
  'falseVal': false,
  'trueVal': true
};

await tbl.write('partitionKey','rowKey',value);

var record = await tbl.read('partitionKey','rowKey');

// record is wrapped with parsed values
//   original values are buried in the prototype chain
var value2 = result.value; // should deep equal value

var records = tbl.query() //records starts off as the query object/wrapper
    // .select('someString','someNumber') // fields to return (optional)
	.where('PartitionKey eq ?', 'partitionKey') // where clause (req)
    // .top(5) //limit results, must be under 1000
	; 

//there is a next method on query, and records that have more
while (records.next) {
  // get the next set of results 
  // if there are more results, will have a .next() function
  records = await records.next();

  records
    .forEach((record /*wrapped*/)=>{
      //do something with unwrapped value
      //can access original response with record.__proto__
    });
}
  
```

## Blob Storage

**TODO**

For now use `storage.createBlobService()`
