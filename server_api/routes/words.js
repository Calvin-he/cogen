"use strict";

const express = require( 'express' ),
  router = express.Router(),
  mongoose = require( 'mongoose' ),
  Word = mongoose.model( 'Word' );

router.get( '/', async( req, res, next ) => {
  let words = await Word.find( {}, 'word updated pronouns' ).sort({created: 1}).limit(100)
  res.send( words )
} )

router.post( '/', async( req, res, next ) => {
  let word = await Word.create( { word: req.body.word } )
  res.send( word )

} )

router.delete('/', async(req, res, next) => {
  Word.findOneAndRemove({word: req.body.word}).then(() => {
    res.sendStatus(200)
  }).catch(next)
})

module.exports = router;