var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var only = require('only');
var Series = mongoose.model('Series');

router.get('/', (req, res, next) => {
  Series.list().then(seriess => res.send(seriess)).catch(next);
});

router.post('/', (req, res, next) => {
  var series = new Series(only(req.body, 'title desc bannerId lessonList'));
  series.save().then((doc) => res.send({id: doc.id})).catch(next);
});

router.put('/:id', (req, res, next) => {
  var fields = only(req.body, 'title desc bannerId lessonList');
  Series.update({_id: req.params.id}, fields).then(() => res.sendStatus(200)).catch(next);
});

router.delete('/:id', (req, res, next) => {
    Series.findByIdAndRemove(req.params.id).then(() => res.sendStatus(200)).catch(next);
});

router.get('/:id', (req, res, next) => {
    Series.findById(req.params.id).then(doc => res.send(doc)).catch(next);
});

module.exports = router;
