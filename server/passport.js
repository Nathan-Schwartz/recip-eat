var GithubStrat    = require('passport-github2').Strategy;
var passport       = require('passport');
var session        = require('express-session');
var uuid           = require('uuid');

var authToken = require('./authentication');
var db        = require('./db/dbUtil');


module.exports = function(app, express) {

  app.use(session({
    genid: function(req) {
      return uuid.v4();
    },
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  }))
  app.use(passport.initialize());
  app.use(passport.session());
  // app.use(passport.authenticate('github', { failureRedirect: '/login',  failureFlash: 'Invalid username or password.' }));

  passport.serializeUser(function(user, done) {
    db.read()
    .then(function(data){
      return done(null, user.id);
    })
  });

  passport.deserializeUser(function(id, done) {
    db.findById({}, id)
    .then(function(thisUser){
      if(thisUser !== -1)
        return done(null, thisUser);
      throw new Error("Passport wanted a user that didn't exist");
    })
    .catch(function(err){
      return done(err, null);
    })
  });

  passport.use(new GithubStrat({
      clientID: authToken.githubClientId,
      clientSecret: authToken.gitHubClientSecret,
      callbackURL: "http://localhost:1337/auth/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      db.findById({ "create": true}, profile.id)
      .then(function(){
        return done(null, profile);
      })
      .catch(function(err){
        return done(err, null);
      })
      // console.log("profile", Object.keys(profile));
    })
  );
}
