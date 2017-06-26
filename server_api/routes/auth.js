var express = require( 'express' );
var router = express.Router();
var mongoose = require( 'mongoose' );
var User = mongoose.model( 'User' );
var auth = require( '../config/auth' );

router.post( '/', ( req, res, next ) => {
  User.authenticate( req.body ).then( user => {
    let token = auth.getToken( user );
    res.send( {
      token: token,
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