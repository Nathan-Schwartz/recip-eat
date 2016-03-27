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
  // app.use(passport.authenticate('github', { failureRedirect: '/login',  failureFlash: 'Invalid username or password.' }));

  passport.serializeUser(function(user, done) {
    console.log("--SERIALIZING--   user is ", Object.keys(user), "id is", user.id);
    return done(null, String(user.id));
  });
  
//NEW BROKEN VERSION
  passport.deserializeUser(function(id, done) {
    console.log("--DESERIALIZING--   id is ", id);
    db.findById({}, id)
    .then(function(thisUser){
      console.log("Retrieved this user:", thisUser.profile);
      if(thisUser === -1) throw new Error("Passport wanted a user that didn't exist");

      return done(null, thisUser.profile);
    })
    .catch(function(err){
      return done(err, null);
    })
  });

// //OLD WORKING VERSION
//   passport.deserializeUser(function(id, done) {

//     db.findById({}, id)
//     .then(function(thisUser){
//       console.log("Retrieved this user:", thisUser[0]);
//       if(thisUser === -1) throw new Error("Passport wanted a user that didn't exist");
      
//       return done(null, thisUser[0]);
//     })
//     .catch(function(err){
//       return done(err, null);
//     })
//   });


//NEW BROKEN VERSION
  passport.use(new GithubStrat({
      clientID: authToken.githubClientId,
      clientSecret: authToken.gitHubClientSecret,
      callbackURL: "http://localhost:1337/auth/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      console.log("--CREATING--   profile is ", Object.keys(profile));
      db.findById({ "create": true}, profile.id, profile._json)
      .then(function(cachedUser){
        return done(null, profile);
      })
      .catch(function(err){
        return done(err, null);
      })
    })
  );
}

// //OLD WORKING VERSION
//   passport.use(new GithubStrat({
//       clientID: authToken.githubClientId,
//       clientSecret: authToken.gitHubClientSecret,
//       callbackURL: "http://localhost:1337/auth/callback"
//     },
//     function(accessToken, refreshToken, profile, done) {
//       db.findById({ "create": true}, profile.id, profile._json)
//       .then(function(){
//         return done(null, profile);
//       })
//       .catch(function(err){
//         return done(err, null);
//       })
//     })
//   );
// }