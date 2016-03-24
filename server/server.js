var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var recipes = require('./recipes');

var app = express();

//var SERVER_KEY = ""
var ROOT_DIRECTORY = __dirname.slice(0,__dirname.indexOf('/server'));

console.log(ROOT_DIRECTORY);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



recipes.get({}, "onions,garlic","omelet", function(recipes){
  console.log("retrieved recipes:",recipes);
});


app.listen(1337);
console.log("App is listening");
