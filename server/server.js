var express      = require('express');
var path         = require('path');
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var queryString  = require('query-string');
var passport     = require('passport');
var GithubStrat  = require('passport-github2').Strategy;

var authToken    = require('./authentication');
var recipes      = require('./recipes');
var db           = require('./dbUtil');

var app = express();

app.use( express.static( path.join(__dirname + '/..') + '/client/public'));
app.use( cookieParser() );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true }) );



db.write({ testing: 1, "2": [3] });
db.read()
.then(function(res){
  console.log("test read & write", res, res.testing)
})
db.findById("testing")
.then(function(res){
  console.log("test find by id", res);
})

app.use(passport.initialize());
app.use(passport.session());

/********************** START needs Database *************************/

// var thisUser;

// passport.serializeUser(function(user, done) {
//   thisUser = user;
//   done(null, 1);
// });

// passport.deserializeUser(function(id, done) {
//   done(err, thisUser);
// });


passport.serializeUser(function(user, done) {
  db.read()
  .then(function(data){
    data.thisUser = data.thisUser || [];
    return db.write(data);
  })
  .then(function(data){
    done(null, user.id);
  })
});

passport.deserializeUser(function(id, done) {
  db.findById(id)
  .then(function(thisUser){
    if(thisUser !== -1)
      return done(null, thisUser);
    throw new Error("Passport wanted a user that didn't exist");
  })
  .catch(function(err){
    return done(err, null);
  })
});

/**************************END needs Database****************************/

passport.use(new GithubStrat({
    clientID: authToken.githubClientId,
    clientSecret: authToken.gitHubClientSecret,
    callbackURL: "http://localhost:1337/auth/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log("profile", profile);
    done(null, profile);
    // User.findOrCreate({ githubId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
  })
);


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


// app.post('/recipe/like', function(req, res) {
//   res.send();
// });


// app.post('/recipe/save', function(req, res) {
  // res.send();
// });


app.listen(1337);
console.log("App is listening");
