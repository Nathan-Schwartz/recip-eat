var Promise = require("bluebird");
var fs      = require('fs');

var readFile = Promise.promisify(fs.readFile);
var writeFile = Promise.promisify(fs.writeFile);

var util = module.exports;

//Everything returns promises. Methods are:
  //updateCounter
  //write
  //addById
  //read
  //findById (can do findOrCreate as well)

//write a duplicate removal function?


util.updateCounter = function(number){
  if(typeof number !== "number" || arguments.length > 1)
    throw new Error("util.updateCounter expected a number (1 argument)");

  return util.read()
  .then(function(res){
    res["_RECIPE_ID_COUNTER"] = number;
    return util.write(res);
  })
  .then(function(){
    return number;
  })
  .catch(function(err){
    console.log("Problems in addById", err);
  })
}

util.write = function(dataText) {
  if(arguments.length > 1)
    throw new Error("util.write expects 1 argument");

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
  if(typeof id !== "string" || arguments.length > 2)
    throw new Error("util.addById expects the first argument to be a string, and there should only be two arguments");

  return util.read()
  .then(function(res){
    if(id === "_ALL_RECIPES"){
      if(Array.isArray(newData)) {
        for(var i=0, length=newData.length; i<length; i++) {
          res[id].push(newData[i]);
        }
      }
      else {
        res[id].push(newData);
      }
    } else {
      if(Array.isArray(newData)) {
        for(var i=0, length=newData.length; i<length; i++) {
          res[id].recipes.push(newData[i]);
        }
      }
      else {
        res[id].recipes.push(newData);
      }
    }

    return util.write(res);
  })
  .catch(function(err){
    console.log("Problems in addById", err);
  })
}

util.findById = function(options, id, profile) {
  if(typeof id !== "string" || typeof options !== "object" || arguments.length > 3)
    throw new Error("util.findById expects the first argument to be a string, second to be an object, and there should only be three arguments");

  profile = profile || null;

  return util.read()
  .then(function(data){
    return data[id] !== undefined
     ? data[id] //exists
     : {found: false, data: data}; //not found
  })
  .then(function(res){
    if(res.found === false && options.create === true){
      res.data[id] = { "profile": profile, "recipes": [] };
      return util.write(res.data)
    } else if (res.found === false && options.create === false) {
      return -1;
    } else {
      return res;    
    }
  })
  .then(function(res){
    if(typeof res === "object" && options.create === true)
      return util.findById({}, id);

    return res;
  })
  .catch(function(err){
    if(err instanceof Error) {
      throw err;
    }
    console.log("Error in findById in util.js", err);
  })
}
