var User = require('../database/user.js');
var google = require('../controllers/google');

exports.createUser = function (data, next) {
  var currentDate = Date.now();
  // var sampleData = {google: {refresh_token: 'blah', last_updated: currentDate}};
  User.create(sampleData, function (err, user) {
    if (!err) {
      next(err, {userID: user._id});
    }
  });
};

exports.retrieveAccessToken = function (userID, next) {
  User.findById(userID, function (err, user) {
    if (!err) {
      let expired = user.google.access_token.expiration_date < Date.now();
      if (user.google.access_token.token && !expired) {
        next(null, user.google.access_token.token);
      } else {
        console.log("db has no google access token")
        google.retrieveAccessToken(userID, function (err, accessToken, expiration_date) {
          this.saveAccessToken(userID, accessToken, expiration_date, next);
        });
      }
    } else {
      next(err);
    }
  })
};

exports.saveAccessToken = function (userID, accessToken, expiration_date, next) {
  User.findById(userID, function (err, user) {
    user.google.access_token.token = accessToken;
    user.google.access_token.expiration_date = expiration_date;
    User.save(function (err, user) {
      if(!err) {
        next(null, user.google.access_token.token)
      } else {
        next(err);
      }
    })
  })
};