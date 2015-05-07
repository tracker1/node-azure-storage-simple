import streamToArray from './stream-to-array';

export default function streamToBuffer(stream) {
  return streamToArray(stream).then((ary)=>Buffer.concat(ary));
}