var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var app = express();


app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '../public')); // idk if I can append '..'

request('http://www.recipepuppy.com/api/?i=onions,garlic&q=omelet&p=1 ', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    processRecipes(JSON.parse(body).results);
  } else {
    if(error instanceof Error)
      throw error;
    else
      console.log(error);
  }
})

function processRecipes(recipes) {
  console.log("recipes:",recipes)
}

app.listen(1337);
console.log("App is listening");
