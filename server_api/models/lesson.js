'use strict';

var mongoose = require('mongoose');
var Media = require('./media');

var LessonSchema = new mongoose.Schema({
  title: { type : String, default : '', trim : true, required: true },
  content: { type : String, default : '', trim : true },
  mediaId: { type: mongoose.Schema.ObjectId, ref: 'Media', required: true},
  mediaPath: { type : String, default : '', trim : true },
  created: {type: Date, default: Date.now },
  updated: {type: Date, default: Date.now }
});

LessonSchema.statics = {
    list: function(){
        return this.find({}).exec();
    }
}
/*
LessonSchema.pre(['save', 'update'], function (next) {
    Media.findById(this.mediaId).then(media => {
        this.mediaPath = media.path;
        next();
    });
    if (media) {
    }else {
        next(new Error('missing media!'));
    }
});
*/

var Lesson = mongoose.model('Lesson', LessonSchema);

module.exports = Lesson;
