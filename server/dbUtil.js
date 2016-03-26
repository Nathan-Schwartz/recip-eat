var Promise = require("bluebird");
var fs      = require('fs');

var readFile = Promise.promisify(fs.readFile);
var writeFile = Promise.promisify(fs.writeFile);

var util = module.exports;

util.read = function() {
  return readFile('./server/db.js')
  .then(function(data){
  	return JSON.parse(String(data));
  })
  .catch(function(err){
  	if(err instanceof Error) {
      throw err;
  	}
  	console.log("Error writing file in util.js", err);
  })
}

util.findById = function(id) {
  return util.read()
  .then(function(text){
    return (text[id] !== undefined)
     ? text[id]
     : -1;
  })
}


util.write = function(dataText) {
  if(typeof dataText !== "string")
    dataText = JSON.stringify(dataText);

  return writeFile('./server/db.js', dataText)
  .catch(function(err){
  	if(err instanceof Error) {
      throw err;
  	}
  	console.log("Error writing file in util.js", err);
  })
}
