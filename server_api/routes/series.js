var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var only = require('only');
var Series = mongoose.model('Series');
var Lesson = mongoose.model('Lesson');
var Media = mongoose.model('Media');


router.get('/', (req, res, next) => {
  Series.list().then(seriess => res.send(seriess)).catch(next);
});

router.post('/', (req, res, next) => {
  var series = new Series(only(req.body, 'title desc price noticeForPurchase bannerId lessonList freeLessons'));
  Media.findById(fields.bannerId).then(media => {
    series.bannerPath = media.path
    series.save().then((doc) => res.send(doc))
  }).catch(next);
});

router.put('/:id', (req, res, next) => {
  var fields = only(req.body, 'title desc price noticeForPurchase bannerId lessonList freeLessons');
  fields.updated = Date.now()
  if(fields.bannerId) {
     Media.findById(fields.bannerId).then(media => {
       fields.bannerPath = media.path
       Series.findByIdAndUpdate(req.params.id, fields, {new: true}).then((doc) => res.send(doc)).catch(next);
     }).catch(next)
  } else {
    Series.findByIdAndUpdate(req.params.id, fields, {new: true}).then((doc) => res.send(doc)).catch(next);
  }
  
});

router.delete('/:id', (req, res, next) => {
    Series.findByIdAndRemove(req.params.id).then(() => res.sendStatus(200)).catch(next);
});

router.get('/:id', (req, res, next) => {
    Series.findById(req.params.id).then(doc => res.send(doc)).catch(next);
});

router.get('/:id/search', (req,res, next) => {
    var seriesId = req.params.id;
    var lessonIds = req.query.lesson_ids
    if(!lessonIds) {
      res.send([])
      return;
    }
    lessonIds = lessonIds.split(',');

    Series.findById(seriesId).then(seriesDoc => {
      Lesson.find({_id : {$in: lessonIds}}, '_id, title mediaPath').then(lessons => {
          let newLessons = lessons.map((les) => {
            if ( seriesDoc.freeLessons.indexOf(les._id) === -1 ) {
              les['mediaPath'] = null
            }
            return les
          })
          res.send(newLessons)
      }).catch(next);
    });
})

module.exports = router;
