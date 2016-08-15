var passport = require('passport'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	moment = require('moment'),
	jwt = require('jwt-simple'),
	config = require('../config/config'),
	request = require('request');

var ERRORS = {
	fill_out_fields: 'Please fill out all fields',
	user_not_found: 'User not found',
	pass_not_match: 'Passwords not match',
	same_pass: 'Please enter new password',
	pass_incorrect: 'Entered password is incorrect',
	user_exist: 'That user already exists',
	invalid_data: 'Invalid email or password'
}

function createJWT(user) {
	var payload = {
		sub: user._id,
		iat: moment().unix(),
		exp: moment().add(14, 'days').unix()
	};
	console.log(payload);
	return jwt.encode(payload, config.TOKEN_SECRET);
}

function ensureAuthenticated(req, res, next) {
	if (!req.header('Authorization')) {
		return res.status(401).send({
			message: 'Please make sure your request has an Authorization header'
		});
	}
	var token = req.header('Authorization').split(' ')[1];

	var payload = null;
	try {
		payload = jwt.decode(token, config.TOKEN_SECRET);
	} catch (err) {
		return res.status(401).send({
			message: err.message
		});
	}

	if (payload.exp <= moment().unix()) {
		return res.status(401).send({
			message: 'Token has expired'
		});
	}
	req.user = payload.sub;
	next();
}

//module.exports.register = function (req, res, next) {
//    var alreadyExists = false;
//    if (!req.body.email || !req.body.password || !req.body.repPassword) {
//        return res.status(400).json({
//            message: ERRORS.fill_out_fields
//        });
//    }
//    if (req.body.password !== req.body.repPassword) {
//        return res.status(400).json({
//            message: ERRORS.pass_not_match
//        });
//    }
//
//    User.findOne({
//        email: req.body.email
//    }, function (err, user) {
//        if (user) {
//            return res.status(400).json({
//                message: ERRORS.user_exist
//            });
//        }
//
//        var user = new User();
//        user.email = req.body.email;
//		user.displayName = req.body.displayName,
//        user.setPassword(req.body.password)
//
//        user.save(function (err) {
//            if (err) {
//                return next(err);
//            }
//            var token;
//            token = createJWT(user) ;
//            res.status(200);
//            res.json({
//                "token": token
//            });
//			console.log(token);
//        });
//    });
//  }


module.exports.register = function (req, res) {
	User.findOne({
		email: req.body.email
	}, function (err, existingUser) {
		if (existingUser) {
			return res.status(409).send({
				message: 'Email is already taken'
			});
		}
		var user = new User({
			displayName: req.body.displayName,
			email: req.body.email,
			password: req.body.password
		});
		user.save(function (err, result) {
			if (err) {
				res.status(500).send({
					message: err.message
				});
			}
			res.send({
				token: createJWT(result),
				user: user
			});
			console.log(result);
		});
	});
};

module.exports.login = function (req, res) {
	User.findOne({
		email: req.body.email
	}, '+password', function (err, user) {
		if (!user) {
			return res.status(401).send({
				message: 'Invalid email and/or password'
			});
		}
		user.comparePassword(req.body.password, function (err, isMatch) {
			if (!isMatch) {
				return res.status(401).send({
					message: 'Invalid email and/or password'
				});
			}
			res.send({
				token: createJWT(user)
			});
		});
	});
};





//module.exports.login = function (req, res, next) {
//    console.log(req.body.email + "is is logging to server");
//
//    console.log("All users in database:");
//    User.find({}, function (err, res) {
//        res.forEach(function (elem, index, array) {
//            console.log("  - " + elem.email + "(" + elem._id + ")");
//        })
//    });
//
//    if (!req.body.email || !req.body.password) {
//        return res.status(400).json({
//            message: ERRORS.fill_out_fields
//        });
//    }
//    passport.authenticate('local', function (err, user, info) {
//        if (err) {
//            console.log("ERROR: " + err);
//            return next(err);
//        }
//        if (user) {
//            console.log("USER FOUND");
//            token = user.generateJwt();
//            res.status(200);
//            res.json({
//                "token": token
//            });
//        } else {
//            console.log("USER NOT FOUND");
//            return res.status(401).json({
//                message: ERRORS.invalid_data
//            });
//        }
//    })(req, res, next);
//}



module.exports.changePassword = function (req, res, next) {
	if (!req.body.currentPass || !req.body.newPass || !req.body.newPassRepeat) {
		return res.status(400).json({
			message: ERRORS.fill_out_fields
		});
	}

	if (req.body.newPass !== req.body.newPassRepeat) {
		return res.status(400).json({
			message: ERRORS.pass_not_match
		});
	}
	if (req.body.newPass == req.body.newPassRepeat && req.body.newPass == req.body.currentPass) {
		return res.status(400).json({
			message: ERRORS.same_pass
		});
	}

	User.findOne({
		email: req.body.email
	}, function (err, user) {
		if (user === undefined) {
			return res.status(400).json({
				message: ERRORS.user_not_found
			});
		} else {
			if (user.validPassword(req.body.currentPass)) {
				user.setPassword(req.body.newPass);

				user.save(function (err) {
					if (err) {
						return next(err);
					}
					var token;
					token = user.generateJwt();
					res.status(200);
					res.json({
						"token": token
					});
				});
			} else {
				return res.status(400).json({
					message: ERRORS.pass_incorrect
				});
			}
		}
	});
}


module.exports.getUserInfo = function (req, res) {
	if (ensureAuthenticated()) {
		User.findById(req.user, function (err, user) {
			res.send(user);
		});
	}
}
module.exports.putUserInfo = function (req, res) {
	if (ensureAuthenticated()) {
		User.findById(req.user, function (err, user) {
			if (!user) {
				return res.status(400).send({
					message: 'User not found'
				});
			}
			user.displayName = req.body.displayName || user.displayName;
			user.email = req.body.email || user.email;
			user.save(function (err) {
				res.status(200).end();
			});
		});
	}
}




module.exports.googleAuth = function (req, res) {
	var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
	var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
	var params = {
		code: req.body.code,
		client_id: req.body.clientId,
		client_secret: config.GOOGLE_SECRET,
		redirect_uri: req.body.redirectUri,
		grant_type: 'authorization_code'
	};


	request.post(accessTokenUrl, {
		json: true,
		form: params
	}, function (err, response, token) {
		var accessToken = token.access_token;
		var headers = {
			Authorization: 'Bearer ' + accessToken
		};


		request.get({
			url: peopleApiUrl,
			headers: headers,
			json: true
		}, function (err, response, profile) {
			if (profile.error) {
				return res.status(500).send({
					message: profile.error.message
				});
			}

			if (req.header('Authorization')) {
				User.findOne({
					google: profile.sub
				}, function (err, existingUser) {
					if (existingUser) {
						return res.status(409).send({
							message: 'There is already a Google account that belongs to you'
						});
					}
					var token = req.header('Authorization').split(' ')[1];
					var payload = jwt.decode(token, config.TOKEN_SECRET);
					User.findById(payload.sub, function (err, user) {
						if (!user) {
							return res.status(400).send({
								message: 'User not found'
							});
						}
						user.email =
							user.google = profile.sub;
						user.picture = user.picture || profile.picture.replace('sz=50', 'sz=200');
						user.displayName = user.displayName || profile.name;
						user.save(function () {
							var token = createJWT(user);
							console.log('google: ' + token);
							res.send({
								token: token
							});
						});
					});
				});
			} else {
				// Step 3b. Create a new user account or return an existing one.
				User.findOne({
					google: profile.sub
				}, function (err, existingUser) {
					if (existingUser) {
						return res.send({
							token: createJWT(existingUser)
						});
					}
					var user = new User();
					user.email = profile.email;
					user.google = profile.sub;
					user.picture = profile.picture.replace('sz=50', 'sz=200');
					user.displayName = profile.name;
					user.save(function (err) {
						var token = createJWT(user);
						console.log(token + 'server');
						res.send({
							token: token,
							profile: profile,
							user: user
						});
					});
				});
			}
		});
	});
}
module.exports.facebookAuth = function (req, res) {
	var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
	var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
	var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
	var params = {
		code: req.body.code,
		client_id: req.body.clientId,
		client_secret: config.FACEBOOK_SECRET,
		redirect_uri: req.body.redirectUri
	};

	request.get({
		url: accessTokenUrl,
		qs: params,
		json: true
	}, function (err, response, accessToken) {
		if (response.statusCode !== 200) {
			return res.status(500).send({
				message: accessToken.error.message
			});
		}


		request.get({
			url: graphApiUrl,
			qs: accessToken,
			json: true
		}, function (err, response, profile) {
			if (response.statusCode !== 200) {
				return res.status(500).send({
					message: profile.error.message
				});
			}
			if (req.header('Authorization')) {
				User.findOne({
					facebook: profile.id
				}, function (err, existingUser) {
					if (existingUser) {
						return res.status(409).send({
							message: 'There is already a Facebook account that belongs to you'
						});
					}
					var token = req.header('Authorization').split(' ')[1];
					var payload = jwt.decode(token, config.TOKEN_SECRET);
					User.findById(payload.sub, function (err, user) {
						if (!user) {
							return res.status(400).send({
								message: 'User not found'
							});
						}
						user.facebook = profile.id;
						user.picture = user.picture || 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
						user.displayName = user.displayName || profile.name;
						user.save(function () {
							var token = createJWT(user);
							res.send({
								token: token
							});
						});
					});
				});
			} else {

				User.findOne({
					facebook: profile.id
				}, function (err, existingUser) {
					if (existingUser) {
						var token = createJWT(existingUser);
						return res.send({
							token: token
						});
					}
					var user = new User();
					user.email = profile.email;
					user.facebook = profile.id;
					user.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
					user.displayName = profile.name;
					user.save(function () {
						var token = createJWT(user);
						res.send({
							token: token
						});
					});
				});
			}
		});
	});
}