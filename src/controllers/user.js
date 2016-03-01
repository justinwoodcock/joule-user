var User = require('../models/user.js');

var UserController = function () {};

UserController.prototype.findUser = function (queryParams, response) {
  User.find(queryParams, function (err, res) {
    if (err) {
      response.setHttpStatusCode(404);
      return response.send(err); 
    }
    return response.send(res);
  });
};

UserController.prototype.createUser = function (postData, response) {
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
};

module.exports = new UserController();
