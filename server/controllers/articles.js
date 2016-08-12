var passport = require('passport'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Feed = mongoose.model('Feed'),
    Article = mongoose.model('Article');

var results = {
    articles: []
};

module.exports.all = function (req, res, next) {
    User.findById(req.user._id).populate({
        path: 'feeds',
        model: 'Feed'
    }).exec(function (err, result) {
        if (err) {
            console.log("ERROR: " + err);
            return next(err);
        }
        res.status(200).json(result.feeds);
    });
}

module.exports.byFeed = function (req, res, next) {
    return Feed.findById(req.params.id, function (err, feed) {
        if (err) {
            console.log("ERROR: " + err);
            return next(err);
        }
        res.status(200).json(feed);
    });
}

module.exports.byCategory = function (req, res, next) {
    User.findById(req.user._id).populate({
        path: 'feeds',
        model: 'Feed'
    }).exec(function (err, result) {
        if (err) {
            console.log("ERROR: " + err);
            return next(err);
        }
        var temp = result.feeds.filter(function (value) {
            return value.category === req.params.cat;
        });
        res.status(200).json(temp);
    });
}