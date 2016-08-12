/**
 * Created by olga on 05.08.16.
 */
var multer = require('multer');
var mongoose = require('mongoose');


var storage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
    cb(null, './server/uploads/');
  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now();
    cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
  }
});

var upload = multer({ //multer settings
  storage: storage
}).single('file');

/** API path that will upload the files */
module.exports.upload = function (req, res) {
  console.log("Upload!!!");
  upload(req, res, function (err) {
    console.log(req.file);


    if (err) {
      res.json({
        error_code: 1,
        err_desc: err
      });
      return;
    }

    
    // @TODO: need to create req.user object using jwt token 
  /*  mongoose.model('User').findOneAndUpdate({_id: req.user.id}, {avatar: req.file.path}, {new: true}, function (err, user) {

      err
          ? res.json({
            error_code: 1,
            err_desc: err
            })
          : res.json({
            error_code: 0,
            err_desc: null,
            user: user
            });
    });*/


  });
};