"use strict";

const axios = require( 'axios' ),
  mongoose = require( 'mongoose' ),
  fs = require( 'fs' ),
  path = require( 'path' ),
  process = require( 'process' ),
  config = require( '../config/config.js' );

mongoose.Promise = require( 'bluebird' );
require( '../models/word.js' );

const httpClient = axios.create( {
  baseURL: 'httpClients://apifree.forvo.com/',
  timeout: 30000
} );

var request_count = 0;
httpClient.interceptors.request.use( function( config ) {
  request_count += 1;
  console.debug( config.url );
  return config;
} );

var wordDir = path.resolve( config.mediaDir, 'words' );
if ( !fs.existsSync( wordDir ) ) {
  fs.mkdirSync( wordDir );
};

async function download() {
  try {
    const Word = mongoose.model( 'Word' );
    let wordList = await Word.find( { _forvoResults: null }, "_id word" ).limit( 100 );
    for ( let word of wordList ) {
      if ( request_count <= 490 ) {
        try {
          let data = await downloadWord( word.word );
          await Word.findByIdAndUpdate( word._id, data );
          console.log( `Download ${word.word} successfully.` )
        } catch ( err ) {
          console.log( 'Failed to download word: ' + word );
        }
      } else {
        break;
      }
    }
    await mongoose.disconnect();
    console.log( 'Disconnect from MongoDB.' );
  } catch ( err ) {
    console.log( err )
  } finally {
    process.exit( 0 )
  }
}

async function downloadWord( word ) {
  return new Promise( async( resolve, reject ) => {
    let requestUrl = `/key/b8db39d70ab29024e9fa51f91779e08f/format/json/action/word-pronunciations/word/${word}/language/en/order/rate-desc`;
    let res = await httpClient.get( requestUrl );
    if ( res.status !== 200 ) {
      reject( new Error( `Failed to get word '${word}' From forvo.com.` ) );
    }
    const pronouns = [];
    let resData = res.data;

    // make sure directory is correct
    var date = new Date();
    var audioDir = path.join( wordDir, `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}` );
    if ( !fs.existsSync( audioDir ) ) {
      fs.mkdirSync( audioDir );
    }
    try {
      for ( let i = 0; i < 9 && i < resData.items.length; ++i ) {
        let item = resData.items[ i ];
        let audioRes = await httpClient.get( item.pathmp3, {
          responseType: 'stream'
        } );
        let audioPath = path.join( audioDir, `${word}_${i+1}.mp3` );
        audioRes.data.pipe( fs.createWriteStream( audioPath, { flags: 'w+' } ) );
        pronouns.push( {
          _id: item.id,
          countryOfReader: item.country,
          sexOfReader: item.sex,
          audioPath: audioPath.replace( path.resolve( config.mediaDir ), '/media' ).replace( /\\/g, '/' )
        } );
      }
      resolve( {
        _forvoResults: resData,
        pronouns: pronouns
      } );
    } catch ( err ) {
      reject( new Error( `Failed to download audio data for Word 'word' ` ) )
    }  
  } );
}

async function importWords( filename ) {
  const Word = mongoose.model( 'Word' );
  let wordList = fs.readFileSync( filename ).toString().split( '\n' );
  console.log( "count of words: " + wordList.length );
  for ( let word of wordList ) {
    word = word.trim()
    if ( word ) {
      try {
        await new Word( { word: word.trim() } ).save()
      } catch ( err ) {}
    }
  }
}

function connectDB() {
  var options = { server: { socketOptions: { keepAlive: 1 }, poolSize: 1 } };
  return mongoose.connect( config.db, options ).connection;
}

if ( process.argv[ 2 ] === 'start' ) {
  connectDB()
    .on( 'error', console.log )
    .once( 'open', download )
} else if ( process.argv[ 2 ] === 'import' ) {
  if ( !fs.existsSync( process.argv[ 3 ] ) ) {
    console.error( `Input file ${process.argv[3]} does not exist!` );
  }
  connectDB()
    .on( 'error', console.log )
    .once( 'open', () => {
      console.log( "importing words from file: " + process.argv[ 3 ] );
      importWords( process.argv[ 3 ] );
      console.log( "Finished importing words." );
      // mongoose.disconnect();
    } )
} else {
  console.log( "not supported command" )
}




// downloadWord('word').then(result => {
//   console.log(result.pronouns);
// }).catch(err => {
//   console.log(err);
// });