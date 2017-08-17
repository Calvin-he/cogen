'use strict';

var mongoose = require('mongoose');
var Media = require('./media');

var CommentSchema = new mongoose.Schema({
    lessonId: {type: mongoose.Schema.ObjectId, ref: 'Lesson', required: true},
    content: {type: String, required: true},
    voteUpNum: {type: Number, default: 0, required: true},
    top: {type: Number, default: 0, required: true}, //置顶值，值越大，重要性越高 
    created: {type: Date, default: Date.now, required: true},
    username: {type: String, required: true},
    userNickname: {type: String},
    userAvatar: {type: String},
    replied: {type: [CommentSchema], default: [] } //留言回复列表
});

var LessonSchema = new mongoose.Schema({
  title: { type : String, default : '', trim : true, required: true },
  content: { type : String, default : '', trim : true },
  mediaId: { type: mongoose.Schema.ObjectId, ref: 'Media', required: true},
  mediaPath: { type : String, default : '', trim : true },
  mediaId2: { type: mongoose.Schema.ObjectId, ref: 'Media'},
  mediaPath2: { type : String, default : '', trim : true },
  commentsSize: {type: Number, default: 0},
  comments: [CommentSchema],
  created: {type: Date, default: Date.now },
  updated: {type: Date, default: Date.now }
});

LessonSchema.statics = {
    list: function(){
        return this.find({}).exec();
    }
}


CommentSchema.statics = {
    list: function(lessonId){
       return this.find({lessonId: lessonId}).sort({top: -1, created: -1}).exec();
    }
}


var Lesson = mongoose.model('Lesson', LessonSchema);

mongoose.model('Comment', CommentSchema);

module.exports = Lesson;
