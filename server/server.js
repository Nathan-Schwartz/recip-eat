var express      = require('express');
var path         = require('path');
var bodyParser   = require('body-parser');
var passport     = require('passport');
var session      = require('express-session');
var browserify   = require('browserify-middleware');

var API    = require('./models/externalAPI');
var recipe = require('./models/recipe');


var app = express();

//app.use( browserify('./client/dist/bundle.js'));
app.use( express.static( path.join(__dirname,'../client')));

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true }) );

var configureMiddleware = require('./passport')(app,express);

app.get('/bundle', function(){
  res.status(200).send();
});

app.get('/login', passport.authenticate('github', { scope: [ 'user:email' ] }));

app.get('/logout', function(req, res){
  req.session.destroy();
  req.logout();
  res.status(302).redirect('https://github.com/logout');
});

app.get('/auth/callback', passport.authenticate('github', { failureRedirect: '/login', successRedirect: '/' }));

app.post('/user/addfavourite', function(req, res) {

  if(!req.session || !req.session.passport || !req.session.passport.user || !req.body || !req.body.recipeId){
    res.status(403).send();
    throw new Error("Bad things happened because we didn't get a user id or body from the session.");
  }

  recipe.addToList(req.session.passport.user, req.body.recipeId)
  .then(function(){
    res.status(201).send();
  })
  .catch(function(err){
    console.log("user/addfavourite", err)
    res.status(500).send(err);
  })
});

app.get('/user/favourites', function(req, res) {
  if(!req.session || !req.session.passport || !req.session.passport.user){
    res.status(403).send();
    throw new Error("Bad things happened because we didn't get a user id or body from the session.");
  }

  recipe.getList(req.session.passport.user)
  .then(function(fullRecipeData){
    res.status(200).send(JSON.stringify(fullRecipeData));
  })
  .catch(function(err){
    console.log("user/favourites", err)
    res.status(500).send(err);
  })
});


app.get('/', function(req,res){
  res.status(200).send()
});

app.post('/searchRecipePuppy', function(req, res) {

  //Is there a wildcard select for ingredients and category
  var ingredients =  req.body.ingredients || "onions, garlic";
  var category = req.body.category || "omelet";

  //to filter entries without picture pass in {filter:"thumbnail"} instead of {}
  API.searchRecipePuppy({}, ingredients, category)
  .then(function(recipes){
    res.status(200).send(JSON.stringify(recipes));
  })
  .catch(function(err){
    console.log("searchRecipePuppy", err)
    res.status(500).send(err);
  })
});

app.post('/searchFood2Fork', function(req, res) {

  var ingredients =  req.body.ingredients || "onions";

  API.searchFood2Fork({}, ingredients)
  .then(function(recipes){
    res.status(200).send(JSON.stringify(recipes));
  })
  .catch(function(err){
    console.log("searchFood2Fork", err)
    res.status(500).send(err);
  })
});

app.listen(1337);
console.log("App is listening on 1337");
