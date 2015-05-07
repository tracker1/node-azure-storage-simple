import repromise from 'repromise';
import toStream from '../convert/to-stream';
import clone from 'safe-clone-deep';
import zlib from 'zlib';

export default function writeBuffer(...params){
  return repromise(()=>writeBufferPromise(...params));
}

function writeBufferPromise(svc,containerName,path,options,data) {
  //options are optional
  if (typeof data === 'undefined') {
    data = options;
    options = {};
  }

  //must have a value
  if (typeof data === 'undefined' || data === null) return Promise.reject(new Error('No data specified'));

  try {
    if (typeof data === 'string') return safeText()
    if (!(data instanceof Buffer)) return saveJson();
    return saveBinary();
  } catch(err) {
    return Promise.reject(err);
  }

  function saveText() {
    data = new Buffer(data);
    options.contentType = options.contentType || 'text/plain, charset=UTF-8';
    return saveBinary();
  }

  function saveJson() {
    data = new Buffer(JSON.stringify(clone(data)));
    options.contentType = options.contentType || 'application/json';
    return saveBinary();
  }

  function saveBinary() {
    return new Promise((resolve,reject)=>{
      svc.createBlockBlobFromStream(containerName,path,toStream(data),data.length,options,(err,result,response)=>{
        if (err) {
          err.detail = {response};
          return reject(err);
        }
        return resolve(result);
      });
    });
  }
}
