module.exports = unwrapTableValues;

function unwrapTableValues(result) {
  //push azure based properties onto inheritance chain
  var ret = Object.create(result); //wrap original values into prototype chain

  //copy parsed values onto return object
  for (var key in result) {
    //don't include azure added properties
    if (!result.hasOwnProperty(key)) continue;
    if (key === ".metadata") continue;
    if (key === "Timestamp") continue;
    if (key === "PartitionKey") continue;
    if (key === "RowKey") continue;

    //get the value for the key
    var val = result[key];

    //unwrap value
    if (typeof val === 'object' && val.hasOwnProperty('_')) val = val._;

    //parse value, assign to response object directly
    ret[key] = parseValue(val);
  }

  //return object
  return ret;
}


function parseValue(val) {
  //nothing to process
  if (typeof val !== "string") return val;
  
  var ret;

  try {
    val = val.trim();
    val = jsonDateHydration('',val);

    //looks like a supported JSON literal value, parse it
    if ((/^(true|false|null|\d+|\d+\.\d+)$/i).test(val)) return JSON.parse(val.toLowerCase()); 

    if (val.length < 2) return val; //not long enough to be a wrapped value

    var f = val[0];
    var l = val[val.length-1];

    // looks like a json object, array, or quoted string, parse it
    if ((f === '{' && l === '}') || (f === '[' && l === ']') || (f === '"' && l === '"')) return JSON.parse(val,jsonDateHydration);

  } catch(err) {}

  return val;
}


function jsonDateHydration(key,val) {

  //not a string, nothing to do
  if (typeof val !== 'string') return val;

  //too short or too long to be a date
  if (val.length < 10 || val.length > 25) return val; //too short or too long

  //looks like a date-time
  if ((/^\d{4}\-\d{2}\-\d{2}T\d{2}\:\d{2}\:\d{2}/).test(val)) {
    try {
      //try to parse it
      var ret = new Date(val);

      //has a valid value
      if (!isNaN(ret)) return ret;
    } catch(err) {}
  }

  //fallback, return original value
  return val;
}