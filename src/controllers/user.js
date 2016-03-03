var jwt = require('jsonwebtoken');
var BaseController = require('./base.js');
var User = require('../models/user.js');
var jwtSecret = process.env.JwtSecret;

var UserController = function () {};

UserController.prototype = BaseController;

UserController.prototype.findUser = function (queryParams, response) {
  var self = this;
  self.verifyJwt(queryParams.token,
    function () {
      delete queryParams.token;
      User.find(queryParams, function (err, res) {
        if (err) {
          response.setHttpStatusCode(404);
          return response.send(err); 
        }
        return response.send(res);
      });
    },
    function (err) {
      var err = {
        error: 'Your token is bad'
      };
      response.setHttpStatusCode(403);
      return response.send(err);
    });
};

UserController.prototype.createUser = function (postData, response) {
  var self = this;
  self.isUserAdmin(postData.userId, function (isAdmin) {
    self.verifyJwt(postData.token, function () {
      var user = new User({
        name: postData.name,
        username: postData.username,
        password: postData.password,
        email: postData.email,
        dob: postData.dob,
        admin: postData.admin
      });
      user.save(function (err, res) {
        if (err) {
          response.setHttpStatusCode(404);
          return response.send(err); 
        }
        return response.send(res);
      });
    },
    function (err) {
      var err = {
        error: 'Your token is bad'
      };
      response.setHttpStatusCode(403);
      return response.send(err);
    });
  }, function (err) {
    var err = {
      error: 'User is either not an admin, or there was no userId in your POST.'
    };
    response.setHttpStatusCode(404);
    return response.send(err);
  });
};

UserController.prototype.seedUser = function () {
  var user = new User({
    name: 'admin',
    username: 'admin',
    password: 'password',
    email: 'admin@admin.com',
    admin: true
  });
  user.save(function (err, res) {
    if (err) {
      console.log('There was an error seeding the admin user.')
    }
    console.log('The admin user was seeded.')
  });
};

UserController.prototype.authUser = function (postData, response) {
  var self = this;
  User.count({}, function (err, count) {
    if (count === 0) {
      self.seedUser();
    }
  });
  User.findOne(postData, function (err, user) {
    if (err) {
      response.setHttpStatusCode(404);
      return response.send(err);
    }
    jwt.sign(user, jwtSecret, {
      expiresIn: "24h"
    }, function (token) {
      var res = {
        token: token,
        user: user
      };
      return response.send(res);
    });
  });
};

module.exports = new UserController();
