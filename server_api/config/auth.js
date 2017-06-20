var basicAuth0 = require( 'basic-auth' );
var config = require( './config' );
var wxclient = require( './wxclient' );

var basicAuth = function( req, response, next ) {

  function unauthorized( response ) {
    response.set( 'WWW-Authenticate', 'Basic realm=Authorization Required' );
    return response.sendStatus( 401 );
  };
  var user = basicAuth0( req );

  if ( !user || !user.name || !user.pass ) {
    return unauthorized( response );
  };

  if ( user.name === config.username && user.pass === config.password ) {
    req.user.isAdmin = true;
    return next();
  } else {
    return unauthorized( response );
  };

};

module.exports = function( req, res, next ) {
  var userId = req.header( 'Authorization' );
  if ( userId ) {
    var isAdmin = userId === config.username
    req.user = { isAdmin: isAdmin, id: userId };
    next();
  } else {
    //res.redirect(wxclient.authorizeURL);
    //basicAuth(req, res, next)
    res.sendStatus( 401 );
  }
}
