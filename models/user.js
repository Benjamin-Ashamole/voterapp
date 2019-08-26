const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: { type: String },
    username: { type: String },
    email: { type: String /*,
      unique: true,
      required: true,
      match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/ */},
    password: { type: String },
    isVerified: {type: Boolean, default: false}
});

UserSchema.pre('save', function(next) {
    let user = this;

    if (!user.isModified('password'))
    return next();

    bcrypt.hash(user.password, 10, function (err, hash){
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });


  // UserSchema.methods.generateJWT = () => {
  //   const beginDate = new Date();
  //   const endDate = new Date(beginDate);
  //
  //   endDate.setDate(beginDate.getDate() + 60);
  //
  //   return jwt.sign({
  //     email: this.email,
  //     id: this._id,
  //     exp: parseInt(endDate.getTime() / 1000, 10 ),
  //   }, 'secret');
  // }
  //
  // UserSchema.methods.toAuthJSON = () => {
  //   return {
  //     _id: this._id,
  //     email: this.email,
  //     token: this.generateJWT(),
  //   };
  // }



  // UserSchema.statics.authenticate = function(email, password, next) {
  //   User.findOne({ email: email })
  //     .exec(function (err, user) {
  //       if (err) {
  //         return next(err)
  //       } else if (!user) {
  //         var err = new Error('User not found.');
  //         err.status = 401;
  //         return next(err);
  //       }
  //       bcrypt.compare(password, user.password, function (err, result) {
  //         if (result === true) {
  //           return next(null, user);
  //         } else {
  //           return next();
  //         }
  //       });
  //     });
  // }
const User = mongoose.model('User', UserSchema);
module.exports = User;
