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
	picture : String,
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
//userSchema.methods.setPassword = function (password) {
//    this.salt = crypto.randomBytes(16).toString('hex');
//    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
//};
//
//userSchema.methods.validPassword = function (password) {
//    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
//    return this.hash === hash;
//};

//userSchema.methods.generateJwt = function () {
//    var expiry = new Date();
//    expiry.setDate(expiry.getDate() + 7);
//
//    return jwt.sign({
//        _id: this._id,
//        email: this.email
//    }, "MY_SECRET",  { expiresIn: parseInt(expiry.getTime() / 1000) });
//};

mongoose.model('User', userSchema);