var getQueueService = require('./get-queue-service');
var clone = require('fclone');

module.exports = getOne;

function getOne(store,key,name) {
  return getQueueService(store,key,name).then(function(svc){
    return new Promise(function(resolve,reject){
      try {
        svc.getMessages(name,1,function(err,result,response){
          if (err) {
            err.details = {response:response};
            return reject(err);
          }
          
          //if no messages, just return null
          if (!(result && result.length)) return resolve(null);

          //unbox result array          
          result = result[0];

          //inherit wrapped object from original result
          var ret = Object.create(result);

          //parse result value
          try {
            ret.value = JSON.parse(result.messagetext);
          } catch(err) {
            ret.value = result.messagetext;
          }

          return resolve(ret);
        });
      } catch(err) {
        return reject(err);
      }
    });
  });
}