var basicAuth0 = require( 'basic-auth' );
var config = require( './config' );
var wxclient = require( './wxclient' );
var jwt = require( 'jsonwebtoken' );

var exports = {}

exports.authRequest = function( req, res, next ) {
  var token = req.header( 'Authorization' );
  if ( token ) {
    jwt.verify( token, config.jwtsecret, function( err, decoded ) {
      if ( !err ) {
        req.user = decoded; //{username, isAdmin}
        next()
      } else {
        res.sendStatus( 403 );
      }
    } );
  } else {
    res.sendStatus( 403 );
  }
}

/**
 * @param expiredDate Seconds Since the Epoch 
 */
exports.getToken = function( {username, isAdmin}, expiredDate ) {
  let token = jwt.sign( {
    username: username,
    isAdmin: !!isAdmin,
    exp: expiredDate
  }, config.jwtsecret);
  return token
}

module.exports = exports