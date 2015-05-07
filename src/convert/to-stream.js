'use strict';
import util from 'util';
import Stream from 'stream';

export default function createReadStream(object, options) {
  return new MultiStream (object, options);
};


class MultiStream extends Stream.Readable {

  constructor(object,options) {
    if (object instanceof Buffer || typeof object === 'string') {
      options = options || {};
      super({
        highWaterMark: options.highWaterMark,
        encoding: options.encoding
      });
    } else {
      super({ objectMode: true });
    }
    this._object = object;
  }

  _read() {
    this.push(this._object);
    this._object = null;
  }

}
