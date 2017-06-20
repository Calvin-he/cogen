var express = require( 'express' );
var router = express.Router();
var config = require( '../config/config' );

router.get( '/', function( req, res, next ) {
  if ( req.query.origin === 'wechat' ) {
    wxclient.getAccessToken( req.query.code, function( err, result ) {
      if ( err ) {
        res.send( err );
      } else {
        res.send( { user: { openid: result.data.openid }, token: result.data.openid, data: result.data } );
      }
    } );
  } else if ( req.query.origin === 'cogen' ) {
    if ( req.query.username === config.username && req.query.password === config.password ) {
      res.send( { token: req.query.username } );
    } else {
      res.sendStatus( 401 );
    }
  } else {
    res.sendStatus( 404 );
  }
} )

router.get( '/wxtest', function( req, res, next ) {
  res.send( { message: 'Hello' } )
} )

module.exports = router