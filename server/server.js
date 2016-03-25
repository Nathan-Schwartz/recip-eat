var request      = require('request');
var path         = require('path');
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var queryString  = require('query-string');
var Promise      = require('bluebird');
var express      = require('express');
var passport     = require('passport');
var GithubStrat  = require('passport-github2').Strategy;
var fs           = require('fs');

var authToken = require('./authentication');
var recipes = require('./recipes');

var app = express();

app.use(express.static( path.join(__dirname + '/..') + '/client/public'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


/*----------------START Untested----------------*/

  app.use(passport.initialize());
  app.use(passport.session()); //have to use express.session first

  passport.use(new GithubStrat({
      clientID: authToken.githubClientId,
      clientSecret: authToken.gitHubClientSecret,
      callbackURL: "http://localhost:1337/auth/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      console.log("profile", profile);
      done(profile);
      // User.findOrCreate({ githubId: profile.id }, function (err, user) {
      //   return done(err, user);
      // });
    })
  );


  app.get('/login', passport.authenticate('github', { scope: [ 'user:email' ] }));

  app.get('/auth/callback', passport.authenticate('github', { failureRedirect: '/login' }), function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

/*----------------END Untested----------------*/









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


// app.post('/login', function(req, res) {
//   res.send();
// });

// app.post('/logout', function(req, res) {
//   res.send();
// });

// app.post('/users/create', function(req, res) {
//   res.send();
// });

// app.post('/users/delete', function(req, res) {
//   res.send();
// });

// app.post('/recipe/like', function(req, res) {
//   res.send();
// });





// app.post('/users/update', function(req, res) {
  // res.send();
// });

// app.post('/recipe/create', function(req, res) {
  // res.send();
// });


// app.post('/recipe/save', function(req, res) {
  // res.send();
// });


app.listen(1337);
console.log("App is listening");
