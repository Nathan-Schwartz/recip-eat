var request = require('request');
var Promise = require('bluebird');

var recipes = module.exports;

recipes.searchRecipePuppy = function(options, ingredients, category, callback){

  //check arguments
  if(typeof ingredients !== "string" || typeof category !== "string" || typeof callback !== "function" || (typeof options !== "object" && options !== undefined))
    throw new Error("recipes.searchRecipePuppy expects 1 options object, 2 strings, and 1 callback (respectively)");


  var allRecipes = [];

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

  //filter if needed
  .then(function(recipes){
    if(options && options.filter === "thumbnail")
      return recipes.filter(byThumbNail);

    else
      return recipes;
  })

  //give recipes back
  .then(function(recipes){
    callback(recipes);
  })
  .catch(function(error){
    console.log("One of the page requests went poorly in searchRecipePuppy =>", error);
  })

  //get all relevant recipes on the specified page
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

recipes.searchFood2Fork = function(options, ingredients, callback){

  //check arguments
  if(typeof ingredients !== "string" || typeof callback !== "function" || (typeof options !== "object" && options !== undefined))
    throw new Error("recipes.get expects 1 options object, 2 strings, and 1 callback (respectively)");

  sendRequest(1)
  .then(function(body){
    return JSON.parse(body);
  })

  // //filter if needed
  // .then(function(recipes){
  //   if(options && options.filter === "thumbnail")
  //     return recipes.filter(byThumbNail);

  //   else
  //     return recipes;
  // })

  //give recipes back
  .then(function(recipes){
    callback(recipes);
  })
  .catch(function(error){
    console.log("The page request went poorly in searchFood2Fork =>", error);
  })

  //get all relevant recipes on the specified page
  function sendRequest(pageNum){
    return new Promise(function(resolve,reject){
      request("http://food2fork.com/api/search?key=d4650ccd9d1218b3977c82811f4772ef&q=" + String(ingredients) + "&sort=r&page=" + String(pageNum), function (error, response, body){
        if(error || response.statusCode !== 200)
          reject(error);
        else
          resolve(body);
      })
    })
  }
}

function byThumbNail(current) {
  return current.thumbnail.length > 0;
}
