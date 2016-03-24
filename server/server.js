var request = require('request');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var queryString = require('query-string');
var Promise = require('bluebird');
var recipes = require('./recipes');
var express = require('express');

var app = express();
var ROOT_DIRECTORY = __dirname.slice(0,__dirname.indexOf('/server'));

app.use(express.static( ROOT_DIRECTORY + '/client/public' ));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', function(req,res){
 res.send();
});

app.post('/searchRecipePuppy', function(req, res) {

  //Is there a wildcard select for ingredients and category
  var ingredients =  req.body.ingredients || "onions, garlic";
  var category = req.body.category || "omelet";

  //to filter entries without picture pass in {filter:"thumbnail"} instead of {}
  recipes.searchRecipePuppy({}, ingredients, category, function(recipes){
    console.log("retrieved recipes:",recipes);
    res.send(JSON.stringify(recipes));
  });
});

app.post('/searchFood2Fork', function(req, res) {

  var ingredients =  req.body.ingredients || "onions";

  recipes.searchFood2Fork({}, ingredients, function(recipes){
    console.log("retrieved recipes:",recipes);
    res.send(JSON.stringify(recipes));
  });
});

app.post('/users/create', function(req, res) {
}

app.post('/users/delete', function(req, res) {
}

app.post('/users/update', function(req, res) {
}

app.post('/recipe/create', function(req, res) {
}

app.post('/recipe/like', function(req, res) {
}

app.post('/recipe/save', function(req, res) {
}


app.listen(1337);
console.log("App is listening");
