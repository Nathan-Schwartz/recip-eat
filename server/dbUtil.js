var Promise = require("bluebird");
var fs      = require('fs');

var readFile = Promise.promisify(fs.readFile);
var writeFile = Promise.promisify(fs.writeFile);

var util = module.exports;

util.read = function() {
  return readFile('./server/db.js')
  .then(function(data){
  	return String(data);
  })
  .catch(function(err){
  	if(err instanceof Error) {
      throw err;
  	}
  	console.log("Error writing file in util.js", err);
  })
}

util.write = function(dataText) {
  return writeFile('./server/db.js', dataText)
  .catch(function(err){
  	if(err instanceof Error) {
      throw err;
  	}
  	console.log("Error writing file in util.js", err);
  })
}
