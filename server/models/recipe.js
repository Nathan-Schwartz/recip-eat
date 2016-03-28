var db = require('../db/dbUtil.js');

var recipeHelpers = module.exports;

recipeHelpers.addToList = function(user, id){

  var allData;

  return db.read()
  .then(function(fullDatabase){
    allData = fullDatabase;
    return fullDatabase[user];
  })
  .then(function(thisUser){
    thisUser.recipes.push( id );
    return db.write( allData );
  })
};

recipeHelpers.getList = function(user){

  var userRecipes;
  var fullRecipeData = [];

  return db.findById({}, user)
  .then(function(thisUser){
    userRecipes = thisUser.recipes.slice();
    return db.findById({}, "_ALL_RECIPES");
  })
  .then(function(allTheRecipes){
    for(var i=0, length=allTheRecipes.length; i<length; i++) {
      if(userRecipes.indexOf( allTheRecipes[i].id )  !== -1) {
        fullRecipeData.push( allTheRecipes[i] );
      }
    }
    return fullRecipeData;
  })
};