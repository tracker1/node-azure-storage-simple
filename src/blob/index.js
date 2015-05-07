import getBlobService from './get-blob-service';
import readBuffer from './read-buffer';
import writeBuffer from './write-buffer';
import deleteBlob from './delete-blob';

export {createBlobWrapper as default};

function createBlobWrapper(store,key,containerName,containerOptions) {
  return {

    // (path, [options]) => Buffer
    read: (...params)=>getBlobService(store,key,containerName,containerOptions).then((svc)=>readBuffer(svc, containerName, ...params))

    // (path, [options], Buffer) => ...
    ,write: (...params)=>getBlobService(store,key,containerName,containerOptions).then((svc)=>writeBuffer(svc, containerName, ...params)) 
    
    // (path, [options]) => ...
    ,delete: (...params)=>getBlobService(store,key,containerName,containerOptions).then((svc)=>deleteBlob(svc, containerName, ...params))

  };
};