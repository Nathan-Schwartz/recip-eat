var express      = require('express');
var path         = require('path');
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var passport     = require('passport');
var session      = require('express-session');
var uuid         = require('uuid');

var recipes = require('./recipes');
var db      = require('./db/dbUtil');

var app = express();

app.use( express.static( path.join(__dirname + '/..') + '/client/public'));
app.use( cookieParser() );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true }) );

var configureMiddleware = require('./passport')(app,express);

// app.use( function(req, res, next){  console.log("---HEADERS---", req.headers, "---COOKIES---", req.cookies,  "---Session---", req.session, req.session.passport); next(); });

app.get('/login', passport.authenticate('github', { scope: [ 'user:email' ] }));

app.get('/logout', function(req, res){
  req.session.destroy();
  req.logout();
  res.redirect('https://github.com/logout');
});

app.get('/auth/callback', passport.authenticate('github', { failureRedirect: '/login', successRedirect: '/' }));

app.get('/test', function(req,res){
  console.log("--GOT THE STUFF --", req.session.passport, req.query);
  res.send()
});


app.post('/user/addfavourite', function(req, res) {
  if(!req.session || !req.session.passport || !req.session.passport.user || !req.query)
    throw new Error("Bad things happened because we didn't get a user id from the session.");

  findById({}, req.session.passport.user)
  .then(function(thisUser){
    //thisUser.recipes.push( req.query );
    //ORR
    thisUser.push( req.query );
    return findById({}, "_ALL_RECIPES");
  }) // TODO: need to write to the object
  
  res.send();
});

app.get('/user/favourites', function(req, res) {
  if(!req.session || !req.session.passport || !req.session.passport.user)
    throw new Error("Bad things happened because we didn't get a user id from the session.");

  var userRecipes;
  var fullRecipeData = [];

  findById({}, req.session.passport.user)
  .then(function(thisUser){
    //userRecipes = thisUser.recipes.slice();
    //ORR
    userRecipes = thisUser.slice(1);
    return findById({}, "_ALL_RECIPES");
  })
  .then(function(allTheRecipes){
    for(var i=0, length=allTheRecipes.length; i<length; i++) {
      if(userRecipes.indexOf( allTheRecipes[i].id )  !== -1) {
        fullRecipeData.push( allTheRecipes[i] );
      }
    }
    res.send(JSON.stringify(fullRecipeData));
  })
  .catch(function(err){
    res.send(err);
  })
});


app.get('/', function(req,res){
  res.send() 
});

app.post('/searchRecipePuppy', function(req, res) {

  //Is there a wildcard select for ingredients and category
  var ingredients =  req.body.ingredients || "onions, garlic";
  var category = req.body.category || "omelet";

  //to filter entries without picture pass in {filter:"thumbnail"} instead of {}
  recipes.searchRecipePuppy({}, ingredients, category)
  .then(function(recipes){
    console.log("retrieved recipes:",recipes);
    res.send(JSON.stringify(recipes));
  })
  .catch(function(err){
    res.send(err);
  })
});

app.post('/searchFood2Fork', function(req, res) {

  var ingredients =  req.body.ingredients || "onions";

  recipes.searchFood2Fork({}, ingredients)
  .then(function(recipes){
    console.log("retrieved recipes:",recipes);
    res.send(JSON.stringify(recipes));
  })
  .catch(function(err){
    res.send(err);
  })
});

app.listen(1337);
console.log("App is listening on 1337");
