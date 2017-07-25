'use strict';

var mongoose = require('mongoose');
var Media = require('./media');

var CommentSchema = new mongoose.Schema({
    username: {type: String, required: true},
    content: {type: String, required: true},
    created: {type: Date, default: Date.now}
})

var LessonSchema = new mongoose.Schema({
  title: { type : String, default : '', trim : true, required: true },
  content: { type : String, default : '', trim : true },
  mediaId: { type: mongoose.Schema.ObjectId, ref: 'Media', required: true},
  mediaPath: { type : String, default : '', trim : true },
  commentsSize: {type: Number, default: 0},
  comments: [CommentSchema],
  created: {type: Date, default: Date.now },
  updated: {type: Date, default: Date.now }
});

LessonSchema.statics = {
    list: function(){
        return this.find({}).exec();
    },
    addComment: function(lessonId, comment){
        return this.findByIdAndUpdate(lessonId,
                {$push: {comments: comment}, $inc: {commentsSize: 1}},
                {fields: {commentsSize: 1}}
                );
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
