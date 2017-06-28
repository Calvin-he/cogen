var express = require( 'express' );
var router = express.Router();
var mongoose = require( 'mongoose' );
var User = mongoose.model( 'User' );
var only = require('only');
var authUtils = require( '../config/auth' );

router.post( '/login', ( req, res, next ) => {
  User.authenticate( req.body ).then( user => {
    let expired =  Math.floor(Date.now() / 1000) + (24 * 60 * 60); // Seconds Since the Epoch
    let token = authUtils.getToken( {username: user.username, isAdmin: user.isAdmin}, expired );
    res.send( {
      token: token,
      expired: expired,
      user: user
    } )
  } ).catch( e => {
    res.sendStatus( 401 );
  } )
} )

/**
 * refresh token
 */
router.get('/refresh', authUtils.authRequest, (req, res, next) => {
  let expired =  Math.floor(Date.now() / 1000) + (24 * 60 * 60); // Seconds Since the Epoch
  let token = authUtils.getToken({username: req.user.username, isAdmin:req.user.isAdmin}, expired)
  res.send({
    token: token,
    expired: expired
  })
})

router.get( '/user', authUtils.authRequest, function( req, res, next ) {
  console.log(req.user);
  User.findOne({username: req.user.username}).then(doc => {
    let user = only(doc, 'username nickname avatar city phoneNo email isAdmin')
    res.send({ data: user })
  }).catch( (err) => {
    res.status(404).send(err)
  })
} )

module.exports = router