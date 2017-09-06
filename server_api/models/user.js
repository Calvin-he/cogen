'use strict';

/**
 * Module dependencies.
 */

const mongoose = require( 'mongoose' );
const crypto = require( 'crypto' );
const config = require( '../config/config' )
var only = require( 'only' );

/**
 * User Schema
 */

const UserSchema = new mongoose.Schema( {
  salt: { type: String },
  avatar: { type: String },
  city: { type: String },
  phoneNo: { type: String },
  email: { type: String },
  sex: {type: Number, default: 0}, // 用户的性别，值为1时是男性，值为2时是女性，值为0时是未知 
  username: { type: String, unique: true, required: true },
  wx_openid: { type: String},
  nickname: { type: String },
  hashed_password: { type: String },
  isAdmin: { type: Boolean, default: false },
  created: { type: Date, default: Date.now },
  paidSeries: mongoose.Schema.Types.Mixed, // {seriesId: lessonIdOfLastRead}
  votedComments: mongoose.Schema.Types.Mixed
} );

const validatePresenceOf = value => value && value.length;
const encryptPassword = ( password, salt ) => {
  if ( !password || !salt ) return '';
  try {
    return crypto
      .createHmac( 'sha1', salt )
      .update( password )
      .digest( 'hex' );
  } catch ( err ) {
    return '';
  }
}


/**
 * Virtuals
 */

UserSchema
  .virtual( 'password' )
  .set( function( password ) {
    if ( validatePresenceOf( password ) ) {
      this.salt = Math.round( ( new Date().valueOf() * Math.random() ) ) + '';
      this.hashed_password = this.encryptPassword( password );
    }
  } );

/**
 * Validations
 */

UserSchema.path( 'username' ).validate( function( username ) {
  return username.length;
}, 'Username cannot be blank' );

UserSchema.path( 'username' ).validate( function( username, fn ) {
  const User = mongoose.model( 'User' );
  // if ( this.skipValidation() ) fn( true );

  // Check only when it is a new user or when email field is modified
  if ( this.isNew || this.isModified( 'username' ) ) {
    User.find( { username: username } ).exec( function( err, users ) {
      fn( !err && users.length === 0 );
    } );
  } else fn( true );
}, 'username already exists' );


/**
 * Pre-save hook
 */

UserSchema.pre( 'save', function( next ) {
  if ( !this.isNew ) return next();

  if ( ( !validatePresenceOf( this.hashed_password ) && !validatePresenceOf( this.wx_openid ) ) ) {
    next( new Error( 'password or open_id is reqired' ) );
  } else {
    next();
  }
} );
/**
 * Methods
 */
UserSchema.methods = {
  encryptPassword: function( password ) {
    if ( !password ) return '';
    try {
      return crypto
        .createHmac( 'sha1', this.salt )
        .update( password )
        .digest( 'hex' );
    } catch ( err ) {
      return '';
    }
  }

};

/**
 * Statics
 */
var wxAuthClient = require( '../config/wxclient' ).authClient
UserSchema.statics = {

  /**
   * Authenticate user by credentials
   *
   * @param Object credentials: {type: cogen, userame: ***, password: password} or {type: wechat, code: ****}
   * @return Promise with user
   * @api public
   */

  authenticate: function( credentials ) {
    const returnedFields = 'username nickname avatar city phoneNo email isAdmin paidSeries'
    if ( credentials.origin === 'cogen' ) {
      // authenticate by username and password
      if ( !credentials.username || !credentials.password ) {
        return Promise.reject( 'Invalid credentials' );
      }
      const preturnedFields = returnedFields + ' hashed_password salt'
      return this.findOne( { username: credentials.username } ).then( user => {

        if ( user.encryptPassword( credentials.password ) === user.hashed_password ) {
          return only( user, returnedFields );
        } else {
          return Promise.reject( 'Invalid credentials' );
        }
      } )
    } else if ( credentials.origin === 'wechat' ) {
      // wechat authenticate
      if ( !credentials.code ) {
        return Promise.reject( 'Invalid credentials' )
      }
      

      return wxAuthClient.getAccessToken( credentials.code ).then( ( result ) => {
        let openid = result.data.openid
        return this.find( { wx_openid: openid } ).then( users => {
          if(users.length === 0) {
            return wxAuthClient.getUser(openid).then((userinfo)=>{
              return new User({
                username: userinfo.openid,
                wx_openid: userinfo.openid,
                nickname: userinfo.nickname,
                sex: userinfo.sex,
                city: userinfo.country + "|" + userinfo.province + "| "+ userinfo.city,
                avatar: userinfo.headimgurl   
              }).save().then(doc => {
                  return only(doc, returnedFields);
              })
            })
          }else {
            return only( users[0], returnedFields);
          }
        } );
      } ).catch(err => {
        console.log(err);
        return Promise.reject( 'Invalid credentials' )
      })
    }
  },

  /**
   * Load
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  load: function( options, cb ) {
    options.select = options.select || 'nickname username';
    return this.findOne( options.criteria )
      .select( options.select )
      .exec( cb );
  },

  addPaidSeries: function(username, seriesId) {
    let updated = {}
    updated['paidSeries.' + seriesId] = null
    return User.update({username: username}, {$set: updated})
  },

  votesComment: function( username, lessonId, commentId ) {
    var addToSet = {};
    addToSet[ "votedComments." + lessonId ] = commentId;
    return User.update( { username: username }, { $addToSet: addToSet } )
  }
};

var User = mongoose.model( 'User', UserSchema );

/**
 * initial the user admin 
 */
User.findOneAndRemove( { username: config.username } ).then( user => {
  new User( {
    nickname: "Administrator",
    username: config.username,
    password: config.password,
    isAdmin: true,
    isNew: true
  } ).save().then( doc => {
    console.log( 'User admin created successfully.' )
  } ).catch( err => {
    console.warn( err )
  } )
} );

module.exports = User