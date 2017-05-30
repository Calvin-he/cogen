var express = require( 'express' );
var router = express.Router();
var basicAuth = require( 'basic-auth' );

router.post( '/', function( req, res, next ) {
  var user = basicAuth( request );

  if ( !user || !user.name || !user.pass ) {
    return unauthorized( response );
  };

  if ( user.name === config.username && user.pass === config.password ) {
    return next();
  } else {
    return unauthorized( response );
  };
} )