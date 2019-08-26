const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth = require('./helpers/auth');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcryptjs');



router.use((req, res, next) => {
  res.locals.title = 'Vote';
  res.locals.currentUserId = req.session.userId;

  next();
});

//configure passport



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Voten' });
});

router.get('/login', function(req, res, next) {
  res.render('login');
})

// router.post('/login', auth.required, (req, res, next) => {
//   const user = new User(req.body);
//
//   if (!user.email) {
//     return res.status(422).json({
//       errors: {
//         email: 'is required',
//       },
//     });
//   }
//
//   if (!user.password) {
//     return res.status(422).json({
//       errors: {
//         password: 'is required',
//       },
//     });
//   }
//
//   return passport.authenticate('local', { session: true }, (err, passportUser, info) => {
//     if (err) { return next(err) }
//
//     if (!passportUser) {
//       return res.redirect('/login');
//     }
//     const user = passportUser;
//     user.token = passportUser.generateJWT();
//     return res.json({ user: user.toAuthJSON() });
//
//     req.logIn(user, (err) => {
//       if (err) { return next(err); }
//       return res.redirect('/')
//     })
//   });
//
// });
router.post('/login', auth.validateToken, (req, res, next) => {
  passport.authenticate('local', { session: true, successRedirect: '/', failureRedirect: '/login', failureFlash: true }
  //   console.log(passportUser);
  //   console.log(info);
  //   if (err) { return next(err)}
  //   if (!passportUser) {
  //     return (res.redirect('/login'))
  //   }
  //   else {
  //   req.session.userId =  passportUser._id;
  //   return res.redirect('/');
  // }
    // req.login(passportUser, (err) => {
    //   if (err) {
    //     return next(err);
    //   }
    //   return res.redirect('/')
    // });
  )(req, res, next);
});


// router.post('/login', passport.authenticate('local', {
//   session: true,
//   successRedirect: '/',
//   failureRedirect:'/login',
//   failureFlash: true
// }, (err, passportUser, info) => {
// console.log('>>>>>', passportUser)
// console.log(info, '<<<<');
// })
// );
// router.post('/login', {session:true, successRedirect: '/',failureRedirect: '/login', failureFlash: true}, function(req, res, next) {
//   passport.authenticate('local', function(err, passportUser, info) {
//     if (err) { return next(err)}
//     if(!passportUser) { return res.redirect('/login') }
//
//     req.logIn(passportUser, (err) => {
//       if (err) { return next(err) }
//       return res.redirect('/')
//     });
//     console.log('>>>>>', passportUser)
//     console.log(info, '<<<<');
//   })
// })


module.exports = router;
