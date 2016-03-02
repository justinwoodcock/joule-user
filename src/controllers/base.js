var jwt = require('jsonwebtoken');
var jwtSecret = process.env.JwtSecret;

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

module.exports = new BaseController();
