var express = require( 'express' );
var router = express.Router();
var mongoose = require( 'mongoose' );
var User = mongoose.model( 'User' );
var auth = require( '../config/auth' );

router.post( '/login', ( req, res, next ) => {
  User.authenticate( req.body ).then( user => {
    let expired =  Math.floor(Date.now() / 1000) + (24 * 60 * 60); // Seconds Since the Epoch
    let token = auth.getToken( {username: user.username, isAdmin: user.isAdmin}, expired );
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
router.get('/refresh', (req, res, next) => {
  let expired =  Math.floor(Date.now() / 1000) + (24 * 60 * 60); // Seconds Since the Epoch
  let token = auth.getToken({username: req.user.username, isAdmin:req.user.isAdmin}, expired)
  res.send({
    token: token,
    expired: expired
  })
})

router.get( '/user', function( req, res, next ) {
  User.findOne({username: req.user.username}).then(doc => {
    let user = only(doc, 'username nickname avatar city phoneNo email isAdmin')
    res.send({ user: user })
  }).catch( (err) => {
    res.status(404).send(err)
  })
} )

module.exports = router