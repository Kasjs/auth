var mongoose = require('mongoose'),
    express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    Article = mongoose.model('Article'),
    Feed = mongoose.model('Feed'),
    User = mongoose.model('User'),
	qs = require('querystring'),
	async = require('async'),
	bcrypt = require('bcryptjs'),
	cors = require('cors'),
	logger = require('morgan'),
	moment = require('moment'),
	request = require('request'),
	config = require('../config/config');


	var authCtrl = require('../controllers/authentication'),
    articlesCtrl = require('../controllers/articles'),
    feedsCtrl = require('../controllers/feeds'),
    profCtrl = require('../controllers/profile');

//router.post('/upload',auth, profCtrl.upload);

router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);
router.post('/changePassword', authCtrl.changePassword);
router.post('/auth/google', authCtrl.googleAuth);
router.post('/auth/facebook', authCtrl.facebookAuth);
//router.get('/api/me', authCtrl.getUserIno);
//router.put('/api/me', authCtrl.putUserIno);

// define user param
// get user and his feeds
router.param('user', feedsCtrl.userParam);
router.get('/users/:user', feedsCtrl.allFeed);
router.get('/users/:user/favourites',  feedsCtrl.allFavourites);

// add new feed
router.post('/users/:user/addFeed', feedsCtrl.add);
router.post('/users/:user/addFavArticle', feedsCtrl.addFavArticle);
// remove feed
router.delete('/users/:user/deleteFeed/:id', feedsCtrl.remove);
router.delete('/users/:user/deleteFavFeed/:id', feedsCtrl.removeFavArticle);

module.exports = router;