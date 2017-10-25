// lesson.mediaPath series.bannerPath media.path lesson.content
const mongoose = require( 'mongoose' );
const config = require( '../config/config.js' );

require( '../models/lesson.js' );
require( '../models/series.js' );
require( '../models/media.js' );

function fix() {
  const Lesson = mongoose.model( 'Lesson' ),
    Series = mongoose.model( 'Series' ),
    Media = mongoose.model( 'Media' );

  Media.find( {}, '_id path' ).then( docs => {
    for ( let doc of docs ) {
      if ( doc.path.startsWith( '/uploads/' ) ) {
        Media.findByIdAndUpdate( doc._id, { path: '/media' + doc.path } ).exec();
      }

    }
  } );

  Lesson.find( {}, '_id mediaPath content' ).then( docs => {
    for ( let doc of docs ) {
      let updated = {}
      if ( doc.mediaPath.startsWith( '/uploads/' ) ) {
        updated.mediaPath = '/media' + doc.mediaPath;   
      }
      if(doc.content.indexOf('"/uploads/')) {
        updated.content = doc.content.replace(/"\/uploads/g, '"/media/uploads');
      }
      if(updated.mediaPath || updated.content) {
        Lesson.findByIdAndUpdate( doc._id, updated ).exec();
      }    
    }
  } );

  Series.find( {}, '_id bannerPath' ).then( docs => {
    for ( let doc of docs ) {
      if ( doc.bannerPath && doc.bannerPath.startsWith( '/uploads/' ) ) {
        Series.findByIdAndUpdate( doc._id, { bannerPath: '/media' + doc.bannerPath } ).exec();
      }
    }
  } );

}


var options = { server: { socketOptions: { keepAlive: 1 }, poolSize: 1 } };
mongoose.connect( config.db, options ).connection.on( 'open', fix );