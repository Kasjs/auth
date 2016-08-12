var mongoose = require('mongoose'),
    crypto = require('crypto'),
    jwt = require('jsonwebtoken'),
	bcrypt = require('bcryptjs');

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
	password: { type: String, select: false },
  	displayName: String,
	facebook: String,
	google: String,
    hash: String,
    salt: String,
    avatar: {
        type: String,
        default: ""
    },
    feeds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Feed'
    }],
    favourites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    }]
});

userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(password, done) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};
mongoose.model('User', userSchema);