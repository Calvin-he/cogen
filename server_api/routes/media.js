'use strict';
var express = require('express')
, router = express.Router()
, upload = require('../config/upload')
, mongoose = require('mongoose')
, Media = mongoose.model('Media');

router.get('/', function(req, res, next) {
    Media.find({}).then(list => res.send(list)).catch(next);
})

router.post('/', upload.single('file'), function(req, res, next) {
    var media = new Media({path: upload.relativePath(req.file)});
    media.save().then(doc => res.send(doc)).catch(next);
})

module.exports = router
