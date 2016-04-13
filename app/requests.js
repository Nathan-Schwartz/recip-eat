var ajaxCalls = module.exports;

ajaxCalls.getFavourites = function(){
  $.ajax({
    method: "GET",
    url: "http://localhost:1337/user/favourites"
  })
  .then(function(gotstuff){
    console.log(gotstuff);
  })
}

ajaxCalls.searchRecipePuppy = function(){
   $.ajax({
    method: "POST",
    url: "http://localhost:1337/searchRecipePuppy",
    data: {"recipeId":"9"}
  })
  .then(function(gotstuff){
    console.log(gotstuff);
  })
}
