var Promise = require("bluebird");
var fs      = require('fs');
var bcrypt  = require('bcryptjs');

var readFile = Promise.promisify(fs.readFile);
var writeFile = Promise.promisify(fs.writeFile);

var util = module.exports;

//Everything returns promises. Methods are:
  //write
  //read
  //findById (can do findOrCreate as well)


util.write = function(dataText) {
  if(typeof dataText !== "string")
    dataText = JSON.stringify(dataText);

  return writeFile('./server/db/db.js', dataText)
  .catch(function(err){
    if(err instanceof Error) {
      throw err;
    }
    console.log("Error writing file in util.js", err);
  })
}

util.read = function() {
  return readFile('./server/db/db.js')
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

util.findById = function(options, id) {
  return util.read()
  .then(function(data){
    return data[id] !== undefined
     ? data[id] //exists
     : {found: false, data: data}; //not found
  })
  .then(function(res){
    if(res.found === false && options.create === true){
      res.data[id] = [];
      return util.write(res.data)
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
    console.log("Error in findById in util.js", err);
  })
}