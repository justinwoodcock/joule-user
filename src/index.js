/**
 * This is a boilerplate repository for managing Users w/ JWT.
 * Forking this repository will give you a User model with auth and JSON Web Tokens.
 */

/*
 * The handler function for all API endpoints.
 * The `event` argument contains all input values.
 *    event.httpMethod, The HTTP method (GET, POST, PUT, etc)
 *    event.{pathParam}, Path parameters as defined in your .joule.yml
 *    event.{queryStringParam}, Query string parameters as defined in your .joule.yml
 */
var Response = require('joule-node-response');
var mongoose = require('mongoose');
var mongoUri = process.env.MongoUri;

var UserController = require('./controllers/user.js');

mongoose.connect(mongoUri);
var db = mongoose.connection;

db.once('open', function () {
  console.log('Successfully connected to ' + db.name + ' MongoDB at ' + db.host);
});

db.on('disconnect', function () {
  console.log('Disconnected from MongoDB: ' + db.name);
});

db.on('error', console.error.bind(console, 'connection error:'));

exports.handler = function(event, context) {
  var response = new Response();
  response.setContext(context);
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');

  switch (event.httpMethod) {
    case 'GET':
      UserController.findUser(event.query, response);
      break;
    case 'POST':
      if (event.path[0] && event.path[0] === 'auth') {
        UserController.authUser(event.post, response);
      } else {
        UserController.createUser(event.post, response);
      }
      break;
    case 'PUT':
    case 'DELETE':
    default:
      var err = {
        error: {
          message: 'The resource doens\'t exist.'
        }
      };
      response.setHttpStatusCode(404);
      response.send(err);
  }
};
