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


// basic db method testing
db.write({ testing: [1], "2": [3] });
db.read()
.then(function(res){
  console.log("test read & write, (should be: { testing: [1], \"2\": [3] }", res, res.testing)
  return db.findById({"create": false},"testing");
})
.then(function(res){
  console.log("test find by id on existing (Should be 1 here)", res);
  return db.findById({"create": false},"didntexist")
})
.then(function(res){
  console.log("test find by id on non-existant (should be -1)", res);
  return db.findById({"create": true},"didntexist")
})
.then(function(res){
  console.log("test findOrCreate on non-existant (should be [])", res);
  return db.findById({"create": false},"didntexist")
})
.then(function(res){
  console.log("test find by id on newly existing (should be []", res);
  return db.addById("testing", 2);
})
.then(function(){
  return db.read()
})
.then(function(res){
  console.log("test add by id with numbers(should be [1,2]", res.testing);
  return db.findById({"create": false},"testing");
})
.then(function(res){
  return db.addById("testing", [3,4]);
})
.then(function(){
  return db.read()
})
.then(function(res){
  console.log("test add by id with arrays(should be [1,2,3,4]", res.testing);
  return db.updateCounter(2);
})
.then(function(res){
  console.log("test increment ID, should be 2", res);
  return db.write({ "_ALL_RECIPES": [], "_RECIPE_ID_COUNTER": 0 });
})


app.listen(1337);
console.log("App is listening");
