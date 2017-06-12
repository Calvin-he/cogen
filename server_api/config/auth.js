var basicAuth = require('basic-auth');
var config = require('./config');

exports.basicAuth = function(request, response, next) {

    function unauthorized(response) {
        response.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return response.sendStatus(401);
    };

    if(request.method.toUpperCase() === 'GET'){
        return next();
    }

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


exports.login = function(request, response, next) {

    function unauthorized(response) {
        return response.sendStatus(401);
    };

    var user = basicAuth(request);
    

    if (!user || !user.name || !user.pass) {
        return unauthorized(response);
    };

    if (user.name === config.username && user.pass === config.password) {
        response.set('Authorization', request.headers.authorization);
        return response.json({'message': 'login success'});
    } else { 
        return unauthorized(response);
    };

};
