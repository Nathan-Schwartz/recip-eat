var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var recipes = require('./recipes');

var app = express();

var API_KEY = "d4650ccd9d1218b3977c82811f4772ef"
var ROOT_DIRECTORY = __dirname.slice(0,__dirname.indexOf('/server'));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//parse out all spaces


app.post('/searchRecipePuppy', function(req, res) {

//Is there a wildcard select for ingredients and category
  var ingredients =  req.body.ingredients || "onions,garlic";
  var category = req.body.category || "omelet";

  recipes.searchRecipePuppy({}, ingredients, category, //to filter entries without picture pass in {filter:"thumbnail"} instead of {}
    function(recipes){
      console.log("retrieved recipes:",recipes);
      res.send(JSON.stringify(recipes));
    }
  );
});


app.post('/searchFood2Fork', function(req, res) {

//blank will get most popular things
  var ingredients =  req.body.ingredients || "onions";

  recipes.searchFood2Fork({}, ingredients, //to filter entries without picture pass in {filter:"thumbnail"} instead of {}
    function(recipes){
      console.log("retrieved recipes:",recipes);
      res.send(JSON.stringify(recipes));
    }
  );
});


app.listen(1337);
console.log("App is listening");
