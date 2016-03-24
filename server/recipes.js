var request = require('request');
var Promise = require('bluebird');

var recipes = module.exports;

recipes.get = function(options, ingredients, category, callback){

  var allRecipes = [];

  if(typeof ingredients !== "string" || typeof category !== "string" || typeof callback !== "function" || (typeof options !== "object" && options !== undefined))
    throw new Error("recipes.get expects 1 options object, 2 strings, and 1 callback (respectively)")

  sendRequest(1)
  .then(function(body){
    allRecipes = allRecipes.concat(JSON.parse(body).results);
    return sendRequest(2);
  })
  .then(function(body){
    allRecipes = allRecipes.concat(JSON.parse(body).results);
    return sendRequest(3);
  })
  .then(function(body){
    return allRecipes.concat(JSON.parse(body).results);
  })
  .then(function(allRecipes){
    callback(allRecipes);
  })
  .catch(function(error){
    console.log("One of the page requests went poorly in recipes.js =>", error);
  })


  function sendRequest(pageNum){
    return new Promise(function(resolve,reject){
      request('http://www.recipepuppy.com/api/?i=' + String(ingredients) + '&q=' + String(category) + '&p=' + String(pageNum), function (error, response, body){
        if(error || response.statusCode !== 200)
          reject(error);
        else
          resolve(body);
      })
    })
  }
}

