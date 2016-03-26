var Promise = require("bluebird");
var fs      = require('fs');
var bcrypt  = require('bcryptjs');

var readFile = Promise.promisify(fs.readFile);
var writeFile = Promise.promisify(fs.writeFile);

var util = module.exports;

//Everything returns promises. Methods are:
  //updateCounter
  //write
  //addById
  //read
  //findById (can do findOrCreate as well)


util.updateCounter = function(number){
  if(typeof number !== "number")
    throw new Error("updateCounter expected a number");

  util.read()
  .then(function(res){
    res["_RECIPE_ID_COUNTER"] = number;
    return util.write(res);
  })
  .catch(function(err){
    console.log("Problems in addById", err);
  })
}

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

util.addById = function(id, newData) {

  util.read()
  .then(function(res){
    res[id].push(newData);
    return util.write(res);
  })
  .catch(function(err){
    console.log("Problems in addById", err);
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
    } else if (res.found === false && options.create === false) {
      return -1;
    }
    return res;
  })
  .then(function(res){
    if(Array.isArray(res))
      return res;
    if(typeof res === "number")
      return res;
    else
      return [];
  })
  .catch(function(err){
    if(err instanceof Error) {
      throw err;
    }
    console.log("Error in findById in util.js", err);
  })
}
