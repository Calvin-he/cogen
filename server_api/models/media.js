'use strict';

var mongoose = require('mongoose');

var MediaSchema = new mongoose.Schema({
  path: { type : String, default : '', trim : true },
  created: {type: Date, default: Date.now },
  updated: {type: Date, default: Date.now }
});

MediaSchema.statics = {
    list: function(){
        return this.find({}).exec();
    }
}

var Media = mongoose.model('Media', MediaSchema);

module.exports = Media;

