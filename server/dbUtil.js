var Promise = require("bluebird");
var fs      = require('fs');

var readFile = Promise.promisify(fs.readFile);
var writeFile = Promise.promisify(fs.writeFile);

var util = module.exports;

//Everything returns promises. Methods are:
  //read
  //write
  //findById
  //findOrCreate



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
  .then(function(data){
    return (data[id] !== undefined && data[id] !== null)
     ? data[id]
     : -1;
  })
}


util.findOrCreate = function(id) {
  return util.findById(id)
  .then(function(result){
    if(result === -1) {
      // !!! unnecessary read call, will fix if time
      return util.read()
    }
    return false;
  })
  .then(function(data){
    if(data){
      data[id] = [];
      return util.write(data)
    }
    return true;
  })
  .then(function(){
    return true;
  })
  .catch(function(err){
    if(err instanceof Error) {
      throw err;
    }
    console.log("Error in findOrCreate in util.js", err);
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
