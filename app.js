'use strict'
var express = require('express'),
    fs = require("fs"),
    app = express(),
    bodyParser = require('body-parser'),
    favicon = require('serve-favicon'),
    path = require('path'),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    multer = require('multer'),
	port = 8080,
	qs = require('querystring'),
	async = require('async'),
	bcrypt = require('bcryptjs'),
	cors = require('cors'),
	logger = require('morgan'),
	jwt = require('jwt-simple'),
	moment = require('moment'),
	request = require('request'),
	config = require('./server/config/config');




// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname,'client','assets','images','favicon.ico')));
require('./server/models/Feeds');
require('./server/models/Articles');
require('./server/models/Users');

require('./server/config/passport');


var routes = require('./server/routes/index');

mongoose.connect('mongodb://localhost/feeds');

app.use(cors());
app.use(logger('dev'));

//app.set('views', path.join(__dirname, 'client'));
//app.set('view engine', 'html');
app.use(function (req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.use(express.static('./client'));
app.use(express.static('./server/uploads'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
})); // support encoded bodies
//app.use(express.session({ secret: 'MY_SECRET' })); 

app.use(passport.initialize());
//app.use(passport.session()); 
app.use('/', routes);

app.use(morgan('dev'));



app.listen(port, function () {
    console.log('Server running on port 8080!');
});

module.exports = app;
