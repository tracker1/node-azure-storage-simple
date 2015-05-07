import repromise from 'repromise';
import streamToBuffer from '../convert/stream-to-buffer';

export default function readBuffer(...params){
  return repromise(()=>readBufferPromise(...params));
}

function readBufferPromise(svc,containerName,path,options) {
  try {
    return streamToBuffer(svc.createReadStream(containerName,path,options));  
  } catch(err) {
    return Promise.reject(err);
  }
}