var addOne = require('./add-one');
var getOne = require('./get-one');
var doneOne = require('./mark-one-done');

module.exports = function createQueueWrapper(store,key,name){
  return {
    add:function(value){ return addOne(store,key,name,value); },
    one:function(){ return getOne(store,key,name); },
    done:function(message){ return doneOne(store,key,name,message); }
  }
};