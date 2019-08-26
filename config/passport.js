const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

//configure passport
module.exports = function(passport) {
  passport.use(new LocalStrategy( {
  usernameField: 'username',
  passwordField: 'password' }, (username, password, done) => {
    User.findOne( { username: username }, (err, user) => {
      if (err) { return done(err)}
      if (!user) {
        return done(null, false, { message: 'Incorrect Username.'})
      }

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if(err) {console.log(err)}
        if (isMatch) {
          return done(null, user)
        } else {
          return done(null, false, {message: 'Incorrect Password'})
        }
      });

      // if (user.isVerified == false) {
      //   return done(null, false, { message: 'Please Verify your email address.'})
      // }
      // else {
      //   return done(null, user)
      // }
      console.log(user)
      return done(null, user)
    });
  }));

  passport.serializeUser(function(user, done) {
    console.log(">>>>",user,"<<<<")
    done(null, user.id);
    console.log(">>>>",user.id,"<<<<")
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, (err, user) => {
      console.log("<<<",user,">>>")
      done(err, user);
    });
  });
}
// passport.use(new LocalStrategy( {
// usernameField: 'user[email]',
// passwordField: 'user[password]', }, (email, password, done) => {
//   User.findOne( { email: email }, (err, user) => {
//     if (err) { return done(err)}
//     if (!user) {
//       return done(null, false, { message: 'Incorrect Username.'})
//     }
//
//     if (user.password != password) {
//       return done(null, false, { message: 'Incorrect Password.'})
//     }
//     return done(null, user)
//   });
// }));
