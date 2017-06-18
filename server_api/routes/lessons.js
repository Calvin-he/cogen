var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var only = require('only');
var Lesson = mongoose.model('Lesson');
var Media = mongoose.model('Media');

/* GET users listing. */
router.get('/', (req, res, next) => {
    Lesson.list().then(lessons => {
        res.send(lessons)
    }).catch(next);
});

router.post('/', (req, res, next) => {
    var fields = only(req.body, 'title content mediaId');
    Media.findById(fields.mediaId).then(media => {
        fields.mediaPath = media.path;
        var lesson = new Lesson(fields);
        return lesson.save().then((doc) => res.send(doc));
    }).catch(next);
});

router.put('/:id', (req, res, next) => {
    var fields = only(req.body, 'title content mediaId');
    fields.updated = Date.now();
    if(fields.mediaId) {
        Media.findById(fields.mediaId).then(media => {
            fields.mediaPath = media.path;
            return Lesson.findByIdAndUpdate(req.params.id, fields, {new: true}).then((doc) => res.send(doc));
        }).catch(next);
    }else {
        Lesson.findByIdAndUpdate(req.params.id, fields, {new: true}).then((doc) => res.send(doc)).catch(next);
    }
    
});

router.delete('/:id', (req, res, next) => {
    Lesson.findByIdAndRemove(req.params.id).then(() => res.sendStatus(200)).catch(next);
});

router.get('/:id', (req, res, next) => {
    Lesson.findById(req.params.id).then(doc => {
        res.send(doc);
    }).catch(next);
});

router.post('/search', (req,res, next) => {
    var lesson_ids = only(req.body, 'lesson_ids series_id').lesson_ids;
    Lesson.find({_id : {$in: lesson_ids}}, '_id, title mediaPath').then(docs => {
        res.send(docs)
    }).catch(next)
})

module.exports = router;
