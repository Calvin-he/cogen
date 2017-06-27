var express = require( 'express' );
var router = express.Router();
var mongoose = require( 'mongoose' );
var User = mongoose.model( 'User' );
var auth = require( '../config/auth' );

router.post( '/', ( req, res, next ) => {
  User.authenticate( req.body ).then( user => {
    let expired =  Math.floor(Date.now() / 1000) + (24 * 60 * 60); // Seconds Since the Epoch
    let token = auth.getToken( user, expired );
    res.send( {
      token: token,
      expired: expired,
      user: user
    } )
  } ).catch( e => {
    res.sendStatus( 401 );
  } )
} )

router.get( '/user', function( req, res, next ) {
  res.send( { message: 'Hello' } )
} )

module.exports = router