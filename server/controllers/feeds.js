var passport = require('passport'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Feed = mongoose.model('Feed'),
    Article = mongoose.model('Article');

var ERRORS = {
    choose_cat: 'Choose category',
    cant_find_user: 'Can\'t find user',
    feed_already_added: 'You have already added this feed ',
    fav_article_already_added: 'You have already added this article to favourites',
    feed_not_found: 'Feed not found',
    article_not_found: 'Article not found',
    server_error: 'Server error',
    internal_error: 'Internal error(%d): %s'
};

module.exports.userParam = function (req, res, next, id) {
    var query = User.findById(id);

    query.exec(function (err, user) {
        if (err) {
            console.log("ERROR: " + err);
            return next(err);
        }
        if (!user) {
            return next(new Error(ERRORS.cant_find_user));
        }
        req.user = user;
        return next();
    });
};

module.exports.allFeed = function (req, res, next) {
    req.user.populate('feeds', function (err, user) {
        var unique = {},
            distinct = [];

        if (err) {
            console.log("ERROR: " + err);
            return next(err);
        }

        //Selecting all uniq user categories
        for (var i in user.feeds) {
            if (typeof (unique[user.feeds[i].category]) === "undefined") {
                distinct.push(user.feeds[i].category);
            }
            unique[user.feeds[i].category] = 0;
        }

        //Writing data to dictionary with category as keys and feeds as values
        var feedsDictionary = [];
        var containsKey = function (key) {
                for (var i = 0; i < feedsDictionary.length; i++) {
                    if (feedsDictionary[i].key === key) {
                        return i;
                    }
                }
                return -1;
            }
            // Push categories as keys
        for (var i = 0; i < distinct.length - 1; i++) {
            feedsDictionary.push({
                key: distinct[i],
                values: []
            });
        }
        // Push feeds as values
        for (var i = 0; i < user.feeds.length; i++) {
            var j = containsKey(user.feeds[i].category);
            if (j >= 0) {
                feedsDictionary[j].values.push(user.feeds[i]);
            }
        }
        res.json(feedsDictionary);
        // Pushing favourites articles with "Favourites" key
    });
}

module.exports.allFavourites = function (req, res, next) {
    req.user.populate({
        path: 'favourites',
        model: 'Article'
    }, function (err, user) {
        var favourites = [];
        console.log("_____Favourites______")
        console.log(user);
        for (var i = 0; i < user.favourites.length; i++) {
            favourites.push(user.favourites[i]);
        }
        res.json(favourites);
    });
}

module.exports.add = function (req, res, next) {
    if (req.body.category === undefined) {
        return res.status(400).json({
            message: ERRORS.choose_cat
        });
    }
    req.user.populate("feeds", function (err, user) {
        console.log(user);
        if (!user.feeds.find(function (elem) {
                console.log("   RSS: " + elem.rsslink);
                console.log("REQRSS: " + req.body.rsslink);
                return elem.rsslink == req.body.rsslink;
            })) {
            var feed = new Feed(req.body);
            feed.save(function (err, feed) {
                if (err) {
                    return next(err);
                }
                user.feeds.push(feed);
                user.save(function (err, user) {
                    if (err) {
                        return next(err);
                    }
                    res.json(feed);
                });
            });
        } else {
            return res.status(400).json({
                message: ERRORS.feed_already_added
            });
        }
    });

};

module.exports.addFavArticle = function (req, res, next) {
    req.user.populate({
        path: 'favourites',
        model: 'Article'
    }, function (err, user) {
        if (user.favourites.find(function (elem) {
                console.log(elem.link);
                console.log(req.body.link);
                return elem.link === req.body.link;
            })) {
            console.log("____________ALREADY ADDED_________________");
            res.statusCode = 400;
            return res.send({
                message: ERRORS.fav_article_already_added
            });
        } else {
            var article = new Article(req.body);
            //    console.log("-------------------article------------");
            //    console.log(article);
            //    console.log("-------------------end------------");
            article.save(function (err, article) {
                if (err) {
                    return next(err);
                }
                req.user.favourites.push(article);
                //        console.log("ARRRAAYY");
                //        console.log(req.user.favourites);
                req.user.save(function (err, user) {
                    if (err) {
                        return next(err);
                    }
                    res.json(article);
                });
            });
        }
    });
};

module.exports.removeFavArticle = function (req, res, next) {
    // First, delete feed record from user feeds array 
    req.user.favourites.forEach(function (elem, index, array) {
        if (elem == req.params.id) {
            req.user.favourites.splice(index, 1);
            req.user.save(function (err) {
                if (err) return handleError(err);
            });
        }
    });

    // Delete feed from database
    return Article.findById(req.params.id, function (err, article) {
        if (!article) {
            res.statusCode = 404;
            return res.send({
                error: ERRORS.article_not_found
            });
        }
        return article.remove(function (err) {
            if (!err) {
                return res.send({
                    status: 'OK'
                });
            } else {
                res.statusCode = 500;
                log.error(ERRORS.internal_error, res.statusCode, err.message);
                return res.send({
                    error: ERRORS.article_not_found
                });
            }
        });
    });
}

module.exports.remove = function (req, res, next) {
    // First, delete feed record from user feeds array 
    req.user.feeds.forEach(function (elem, index, array) {
        if (elem == req.params.id) {
            req.user.feeds.splice(index, 1);
            req.user.save(function (err) {
                if (err) return handleError(err);
            });
        }
    });

    // Delete feed from database
    return Feed.findById(req.params.id, function (err, feed) {
        if (!feed) {
            res.statusCode = 404;
            return res.send({
                error: ERRORS.feed_not_found
            });
        }

        return feed.remove(function (err) {
            if (!err) {
                return res.send({
                    status: 'OK'
                });
            } else {
                res.statusCode = 500;
                log.error(ERRORS.internal_error, res.statusCode, err.message);
                return res.send({
                    error: ERRORS.feed_not_found
                });
            }
        });
    });
}