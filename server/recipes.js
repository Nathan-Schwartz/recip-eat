var Promise   = require('bluebird');
var request   = require('request');
var qs        = require('query-string');
var db        = require('./db/dbUtil');

var authToken = require('./authentication');

var recipes = module.exports;

recipes.searchRecipePuppy = function(options, ingredients, category){

  //check arguments
  if(typeof ingredients !== "string" || typeof category !== "string" || (typeof options !== "object" && options !== undefined))
    throw new Error("recipes.searchRecipePuppy expects 1 options object, 2 strings, and 1 callback (respectively)");

  var allRecipes = [];

  return sendRequest(1)
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
  .then(function(recipes){
  //filter if needed
    return (options && options.filter === "thumbnail")
      ? recipes.filter(byThumbNail)
      : recipes;
  })
  .then(function(recipes){
  //give each entry an id
    return addId(recipes);
  })
  .then(function(recipes){
    return recipes;
  })
  .catch(function(error){
    console.log("One of the page requests went poorly in searchRecipePuppy =>", error);
  })

  function sendRequest(pageNum){
  //get all relevant recipes on the specified page
    return new Promise(function(resolve,reject){
      request('http://www.recipepuppy.com/api/?i=' + queryify(ingredients) + '&q=' + queryify(category) + '&p=' + queryify(pageNum), function (error, response, body){
        if(error || response.statusCode !== 200)
          reject(error);
        else
          resolve(body);
      })
    })
  }
}

recipes.searchFood2Fork = function(options, ingredients){

  //check arguments
  if(typeof ingredients !== "string" || (typeof options !== "object" && options !== undefined))
    throw new Error("recipes.get expects 1 options object, 2 strings, and 1 callback (respectively)");

  return sendRequest(1)
  .then(function(body){
    return JSON.parse(body);
  })
  .catch(function(error){
    console.log("The page request went poorly in searchFood2Fork =>", error);
  })

  function sendRequest(pageNum){
  //get all relevant recipes on the specified page
    return new Promise(function(resolve,reject){
      request("http://food2fork.com/api/search?key=" + authToken.Food2Plate + "&q=" + queryify(ingredients) + "&sort=r&page=" + queryify(pageNum), function (error, response, body){
        if(error || response.statusCode !== 200)
          reject(error);
        else
          resolve(body);
      })
    })
  }
}

function queryify(val){
  return String(val).replace(/ /g,"%20");
}

function byThumbNail(current) {
  return current.thumbnail.length > 0;
}

function addId(recipeObj) {

  return db.findById({}, "_RECIPE_ID_COUNTER")
  .then(function(RecCounter){
    console.log("Got recipe ID counter:", RecCounter);
    for(var i=0, length=recipeObj.length; i<length; i++){
      recipeObj[i].id = RecCounter++;
    }
    return db.updateCounter(RecCounter);
  })
  .then(function(){
    return db.addById("_ALL_RECIPES", recipeObj)
  })
  .then(function(){
    return recipeObj;
  })
}
