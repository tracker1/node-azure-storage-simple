var getQueueService = require('./get-queue-service');

module.exports = markOneDone;

function markOneDone(store,key,name,message) {
  return getQueueService(store,key,name).then(function(svc){
    return new Promise(function(resolve,reject){
      try {
        svc.deleteMessage(name, message.messageid, message.popreceipt, function(err,result,response){
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