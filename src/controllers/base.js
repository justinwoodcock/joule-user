var jwt = require('jsonwebtoken');
var jwtSecret = process.env.JwtSecret;
var User = require('../models/user.js');

var BaseController = function () {};

BaseController.prototype.verifyJwt = function (token, successCallback, errorCallback) {
  jwt.verify(token, jwtSecret, function (err, decoded) {
    if (err) {
      errorCallback(err);
    } else {
      successCallback(decoded);
    }
  });
};

BaseController.prototype.isUserAdmin = function (userId, successCallback, errorCallback) {

  User.findById(userId, function (err, user) {
    if (err) {
      errorCallback(err);
    } else {
      var isAdmin = user && user.admin ? user.admin : false;
      successCallback(isAdmin);
    }
  });
};

module.exports = new BaseController();
