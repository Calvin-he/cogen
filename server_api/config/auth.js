var basicAuth = require('basic-auth');
var config = require('./config');

exports.basicAuth = function(request, response, next) {

    function unauthorized(response) {
        response.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return response.send(401);
    };

    var user = basicAuth(request);

    if (!user || !user.name || !user.pass) {
        return unauthorized(response);
    };

    if (user.name === config.username && user.pass === config.password) {
        return next();
    } else {
        return unauthorized(response);
    };

};

