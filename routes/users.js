const express = require('express');
const router = express.Router();
const auth = require('./helpers/auth')//validateToken;
const User = require('../models/user');
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');

let token;
//let url = '\nhttp:\/\/'+req.headers.host+'\/users\/'+result.token+'.\n'
//
console.log(auth)
router.get('/new', (req, res, next) => {
  res.render('users/new');
})




//Create
// router.post('/', auth.optional, (req, res, next) => {
//
// })
//
// router.get('/', auth.optional, (req, res, next) => {
//
// })
router.post('/', (req, res, next) => {
  let user = new User(req.body);

  let result = {}

  user.save(function(err, user) {
    if (err) { console.error(err) };
    const payload = { user: user._id, email: user.email };
    const options = { expiresIn: '1h', issuer: 'http://'+req.headers.host };
    const secret = 'mynameisobinna'; // just testing stuff here. Will use env variables to hidde the secret later.
    const token = jwt.sign(payload, secret, options);

    result.token = token;
    result.result = user;
    console.log(result)

    let transporter = nodemailer.createTransport({ service: 'AOL', auth: { user: 'obinna0515@aol.com', pass: 'Obinna1!' } });
     let mailOptions = { from: 'obinna0515@aol.com', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n Please verify your account by clicking the link:\nhttp:\/\/'+req.headers.host+'\/users\/'+result.token+'.\n' };
      transporter.sendMail(mailOptions, function (err) {
        console.log(err)
       if (err) {
         const sendMail_error = new Error('Email was not sent');
         sendMail.status = 500;
         return next(sendMail_error);
       }
       // { return res.status(500).send({ msg: err.message }); }

       else {
         res.status(200).send('A verification email has been sent to ' + user.email + '.');
       }
  })
  });
  });


  // router.get('/'+auth.decoded, auth, (req, res, next) => {
  //    console.log('enidninfinfenwein');
  // })



module.exports = router;
