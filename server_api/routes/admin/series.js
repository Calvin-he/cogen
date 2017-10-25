'use strict'

const express = require( 'express' ),
  router = express.Router(),
  mongoose = require( 'mongoose' ),
  Series = mongoose.model( 'Series' ),
  Media = mongoose.model( 'Media' );

router.get( '/', ( req, res, next ) => {
  Series.list().then( seriess => res.send( seriess ) ).catch( next );
} );

router.post( '/', ( req, res, next ) => {
  let series = new Series( only( req.body, 'title desc price noticeForPurchase bannerId lessonList freeLessons' ) );
  Media.findById( fields.bannerId ).then( media => {
    series.bannerPath = media.path
    series.save().then( ( doc ) => res.send( doc ) )
  } ).catch( next );
} );

router.put( '/:id', ( req, res, next ) => {
  let fields = only( req.body, 'title desc price noticeForPurchase bannerId lessonList freeLessons' );
  fields.updated = Date.now()
  if ( fields.bannerId ) {
    Media.findById( fields.bannerId ).then( media => {
      fields.bannerPath = media.path
      Series.findByIdAndUpdate( req.params.id, fields, { new: true } ).then( ( doc ) => res.send( doc ) ).catch( next );
    } ).catch( next )
  } else {
    Series.findByIdAndUpdate( req.params.id, fields, { new: true } ).then( ( doc ) => res.send( doc ) ).catch( next );
  }

} );

router.delete( '/:id', ( req, res, next ) => {
  Series.findByIdAndRemove( req.params.id ).then( () => res.sendStatus( 200 ) ).catch( next );
} );


