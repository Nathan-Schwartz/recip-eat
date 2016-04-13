var express      = require('express');
var path         = require('path');
var bodyParser   = require('body-parser');
var passport     = require('passport');
var session      = require('express-session');
var cors         = require('cors');
var cookieParser = require('cookie-parser')

var API      = require('./models/externalAPI');
var recipe   = require('./models/recipe');
var configMW = require('./passport');

var app = express();

app.use( cookieParser() );
app.use( cors() );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true }) );
configMW(app,express);

app.get('/login', passport.authenticate('github', { scope: [ 'user:email' ] }));

app.get('/logout', function(req, res){
  req.session.destroy();
  req.logout();
  res.clearCookie('userId')
  res.status(302).redirect('https://github.com/logout');
});

app.get('/auth/callback', passport.authenticate('github', { failureRedirect: '/login'}), function(req,res){
  if(!req.session || !req.session.passport || !req.session.passport.user){
    console.log("Passport or user session not instantiated");
    res.redirect('/login');
  } else {
    res.cookie("userId" , String(req.session.passport.user));
    res.redirect("http://localhost:8889");
  }
});

app.post('/user/addfavourite', function(req, res) {
 //!req.session || !req.session.passport || !req.session.passport.user ||
 if(!req.body || !req.body.recipeId || !req.body.userId){
    console.log("Bad things happened", req.body, req.session, req.query, req.cookies);
    res.status(403).send();
   // throw new Error("Bad things happened because we didn't get a user id or body from the session.");
  }

  recipe.addToList(req.body.userId, req.body.recipeId)
  .then(function(){
    res.status(201).send();
  })
  .catch(function(err){
    console.log("user/addfavourite", err)
    res.status(500).send(err);
  })
});

app.get('/user/favourites', function(req, res) {

  if(!req.query || !req.query.userId){
    console.log("Bad things happened because we didn't get a user id or query from the session.");
    res.status(403).send();
    //throw new Error("Bad things happened because we didn't get a user id or query from the session.");
  }

  recipe.getList(req.query.userId)
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
