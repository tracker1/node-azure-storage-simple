var getQueueService = require('./get-queue-service');
var clone = require('safe-clone-deep');

module.exports = addOne;

function addOne(store,key,name,value) {
  return getQueueService(store,key,name).then(function(svc){
    return new Promise(function(resolve,reject){
      try {
        svc.createMessage(name,JSON.stringify(clone(value)),function(err,result,response){
          if (err) {
            err.detail = {response:response};
            return reject(err);
          }
          return resolve(result);
        });
      } catch(err) {
        return reject(err);
      }
    });
  });
}