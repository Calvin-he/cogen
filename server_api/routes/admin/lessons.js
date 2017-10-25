"use strict"

const express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  only = require('only');
const Lesson = mongoose.model('Lesson'),
  Media = mongoose.model("Media");

router.get('/', (req, res, next) => {
    Lesson.list().then(lessons => {
        res.send(lessons)
    }).catch(next);
});

router.post('/', async (req, res, next) => {
    var fields = only(req.body, 'title content mediaId mediaId2');
    if(fields.mediaId) {
        let media = await Media.findById(fields.mediaId).exec()
        fields.mediaPath = media.path;    
    } 
    if(fields.mediaId2) {
        let media2 = await Media.findById(fields.mediaId2).exec()
        fields.mediaPath2 = media2.path        
    }
    let lesson = new Lesson(fields);
    lesson.save().then((doc) => res.send(doc));
});

router.put('/:id', async (req, res, next) => {
    var fields = only(req.body, 'title content mediaId mediaId2');
    fields.updated = Date.now();
    if(fields.mediaId) {
        let media = await Media.findById(fields.mediaId).exec()
        fields.mediaPath = media.path;    
    } 
    if(fields.mediaId2) {
        let media2 = await Media.findById(fields.mediaId2).exec()
        fields.mediaPath2 = media2.path        
    }
    Lesson.update({_id: req.params.id}, fields).then(() => {
        Lesson.findById(req.params.id).then(doc => res.send(doc))
    }).catch(next)   
});

router.delete('/:id', (req, res, next) => {
    Lesson.findByIdAndRemove(req.params.id).then(() => res.sendStatus(200)).catch(next);
});
