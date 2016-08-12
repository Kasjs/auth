var passport = require('passport'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

var ERRORS = {
    fill_out_fields: 'Please fill out all fields',
    user_not_found: 'User not found',
    pass_not_match: 'Passwords not match',
    same_pass: 'Please enter new password',
    pass_incorrect: 'Entered password is incorrect',
    user_exist: 'That user already exists',
    invalid_data: 'Invalid email or password'
}

module.exports.register = function (req, res, next) {
    var alreadyExists = false;
    if (!req.body.email || !req.body.password || !req.body.repPassword) {
        return res.status(400).json({
            message: ERRORS.fill_out_fields
        });
    }
    if (req.body.password !== req.body.repPassword) {
        return res.status(400).json({
            message: ERRORS.pass_not_match
        });
    }

    User.findOne({
        email: req.body.email
    }, function (err, user) {
        if (user) {
            return res.status(400).json({
                message: ERRORS.user_exist
            });
        }

        var user = new User();
        user.email = req.body.email;

        user.setPassword(req.body.password)

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
    });
}

module.exports.login = function (req, res, next) {
    console.log(req.body.email + "is is logging to server");

    console.log("All users in database:");
    User.find({}, function (err, res) {
        res.forEach(function (elem, index, array) {
            console.log("  - " + elem.email + "(" + elem._id + ")");
        })
    });

    if (!req.body.email || !req.body.password) {
        return res.status(400).json({
            message: ERRORS.fill_out_fields
        });
    }
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            console.log("ERROR: " + err);
            return next(err);
        }
        if (user) {
            console.log("USER FOUND");
            token = user.generateJwt();
            res.status(200);
            res.json({
                "token": token
            });
        } else {
            console.log("USER NOT FOUND");
            return res.status(401).json({
                message: ERRORS.invalid_data
            });
        }
    })(req, res, next);
}

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