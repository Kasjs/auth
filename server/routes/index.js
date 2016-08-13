var mongoose = require('mongoose'),
    express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    //jwt = require('express-jwt'),
    Article = mongoose.model('Article'),
    Feed = mongoose.model('Feed'),
    User = mongoose.model('User'),
	qs = require('querystring'),
	async = require('async'),
	bcrypt = require('bcryptjs'),
	cors = require('cors'),
	logger = require('morgan'),
	//jwt = require('jwt-simple'),
	moment = require('moment'),
	request = require('request'),
	config = require('../config/config');
//
//var auth = jwt({
//  secret: 'MY_SECRET',
//  userProperty: 'payload'
//});

//function ensureAuthenticated(req, res, next) {
//  if (!req.header('Authorization')) {
//    return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
//  }
//  var token = req.header('Authorization').split(' ')[1];
//
//  var payload = null;
//  try {
//    payload = jwt.decode(token, config.TOKEN_SECRET);
//  }
//  catch (err) {
//    return res.status(401).send({ message: err.message });
//  }
//
//  if (payload.exp <= moment().unix()) {
//    return res.status(401).send({ message: 'Token has expired' });
//  }
//  req.user = payload.sub;
//  next();
//}

//function createJWT(user) {
//  var payload = {
//    sub: user._id,
//    iat: moment().unix(),
//    exp: moment().add(14, 'days').unix()
//  };
//	console.log(payload);
//  return jwt.encode(payload, config.TOKEN_SECRET);
//}

    var articlesCtrl = require('../controllers/articles'),
	authCtrl = require('../controllers/authentication'),
    feedsCtrl = require('../controllers/feeds'),
    profCtrl = require('../controllers/profile');


//router.get('/api/me', ensureAuthenticated, function(req, res) {
//  User.findById(req.user, function(err, user) {
//    res.send(user);
//  });
//});
//
//router.put('/api/me', ensureAuthenticated, function(req, res) {
//  User.findById(req.user, function(err, user) {
//    if (!user) {
//      return res.status(400).send({ message: 'User not found' });
//    }
//    user.displayName = req.body.displayName || user.displayName;
//    user.email = req.body.email || user.email;
//    user.save(function(err) {
//      res.status(200).end();
//    });
//  });
//});
//
//router.post('/login', function(req, res) {
//  User.findOne({ email: req.body.email }, '+password', function(err, user) {
//    if (!user) {
//      return res.status(401).send({ message: 'Invalid email and/or password' });
//    }
//    user.comparePassword(req.body.password, function(err, isMatch) {
//      if (!isMatch) {
//        return res.status(401).send({ message: 'Invalid email and/or password' });
//      }
//      res.send({ token: createJWT(user) });
//    });
//  });
//});
//
//router.post('/register', function(req, res) {
//  User.findOne({ email: req.body.email }, function(err, existingUser) {
//    if (existingUser) {
//      return res.status(409).send({ message: 'Email is already taken' });
//    }
//    var user = new User({
//      displayName: req.body.displayName,
//      email: req.body.email,
//      password: req.body.password
//    });
//    user.save(function(err, result) {
//      if (err) {
//        res.status(500).send({ message: err.message });
//      }
//      res.send({ token: createJWT(result) });
//    });
//  });
//});
//
//router.post('/auth/google', function(req, res) {
//  var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
//  var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
//  var params = {
//    code: req.body.code,
//    client_id: req.body.clientId,
//    client_secret: config.GOOGLE_SECRET,
//    redirect_uri: req.body.redirectUri,
//    grant_type: 'authorization_code'
//  };
//
//  // Step 1. Exchange authorization code for access token.
//  request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token) {
//    var accessToken = token.access_token;
//    var headers = { Authorization: 'Bearer ' + accessToken };
//
//    // Step 2. Retrieve profile information about the current user.
//    request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {
//      if (profile.error) {
//        return res.status(500).send({message: profile.error.message});
//      }
//      // Step 3a. Link user accounts.
//      if (req.header('Authorization')) {
//        User.findOne({ google: profile.sub }, function(err, existingUser) {
//          if (existingUser) {
//            return res.status(409).send({ message: 'There is already a Google account that belongs to you' });
//          }
//          var token = req.header('Authorization').split(' ')[1];
//          var payload = jwt.decode(token, config.TOKEN_SECRET);
//          User.findById(payload.sub, function(err, user) {
//            if (!user) {
//              return res.status(400).send({ message: 'User not found' });
//            }
//            user.google = profile.sub;
//            user.picture = user.picture || profile.picture.replace('sz=50', 'sz=200');
//            user.displayName = user.displayName || profile.name;
//            user.save(function() {
//              var token = createJWT(user);
//				console.log('google: ' + token);
//              res.send({ token: token });
//            });
//          });
//        });
//      } else {
//        // Step 3b. Create a new user account or return an existing one.
//        User.findOne({ google: profile.sub }, function(err, existingUser) {
//          if (existingUser) {
//            return res.send({ token: createJWT(existingUser) });
//          }
//          var user = new User();
//          user.google = profile.sub;
//          user.picture = profile.picture.replace('sz=50', 'sz=200');
//          user.displayName = profile.name;
//          user.save(function(err) {
//            var token = createJWT(user);
//            res.send({ token: token });
//          });
//        });
//      }
//    });
//  });
//});
//
//
//




//router.post('/upload',auth, profCtrl.upload);

router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);
router.post('/changePassword', authCtrl.changePassword);
router.post('/auth/google', authCtrl.googleAuth);

// define user param
router.param('user', feedsCtrl.userParam);
// get user and his feeds
router.get('/users/:user', feedsCtrl.allFeed);
router.get('/users/:user/favourites',  feedsCtrl.allFavourites);

// add new feed
router.post('/users/:user/addFeed', feedsCtrl.add);
router.post('/users/:user/addFavArticle', feedsCtrl.addFavArticle);
// remove feed
router.delete('/users/:user/deleteFeed/:id', feedsCtrl.remove);
router.delete('/users/:user/deleteFavFeed/:id', feedsCtrl.removeFavArticle);

module.exports = router;