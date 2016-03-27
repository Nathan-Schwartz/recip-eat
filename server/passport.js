var GithubStrat = require('passport-github2').Strategy;
var passport    = require('passport');
var session     = require('express-session');
var uuid        = require('uuid');

var authToken = require('./authentication');
var db        = require('./db/dbUtil');

//Disclaimer: I have no idea how these sessions work.


// These end points would have to exist for this passport config to work:
// app.get('/login', passport.authenticate('github', { scope: [ 'user:email' ] }));

// app.get('/logout', function(req, res){
//  // req.session.destroy();
//   req.logout();
//   res.redirect('https://github.com/logout');
// });

// app.get('/auth/callback', passport.authenticate('github', { failureRedirect: '/login', successRedirect: '/' }));

module.exports = function(app, express) {

  app.use(session(
    {
      genid: uuid.v4,
      secret: 'sosecretyoudneverguessitlikeforreal',
      resave: true,
      saveUninitialized: true
    }
  ))

  app.use(passport.initialize());
  app.use(passport.session());
  app.use("/user/*", passport.authenticate('github', { failureRedirect: 'http://www.google.com',  failureFlash: 'Invalid username or password.' }));

  passport.serializeUser(function(user, done) {
    return done(null, String(user.id));
  });

  passport.deserializeUser(function(id, done) {

    db.findById({}, id)
    .then(function(thisUser){
      if(thisUser !== -1)
        return done(null, thisUser.profile);
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
      console.log("profile", profile);
      db.findById({ "create": true}, profile._json.id, profile._json)
      .then(function(){
        return done(null, profile);
      })
      .catch(function(err){
        return done(err, null);
      })
    })
  );
}
