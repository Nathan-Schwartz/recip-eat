var express      = require('express');
var path         = require('path');
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var queryString  = require('query-string');
var passport    = require('passport');

var recipes   = require('./recipes');
var db        = require('./db/dbUtil');

var app = express();
require('./passport')(app,express);

// var testDatabase = require('./fakeDatabaseTests.js')();

app.use(express.static( path.join(__dirname + '/..') + '/client/public' ));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/login', passport.authenticate('github', { scope: [ 'user:email' ] }));

app.get('/auth/callback', passport.authenticate('github', { failureRedirect: '/login', successRedirect: '/' }));

app.get('/', function(req,res){
  res.send();
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
  });
});

app.post('/searchFood2Fork', function(req, res) {

  var ingredients =  req.body.ingredients || "onions";

  recipes.searchFood2Fork({}, ingredients)
  .then(function(recipes){
    console.log("retrieved recipes:",recipes);
    res.send(JSON.stringify(recipes));
  });
});


// app.post('/recipe/like', function(req, res) {
//   res.send();
// });


app.listen(1337);
console.log("App is listening");
