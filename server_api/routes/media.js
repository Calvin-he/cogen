'use strict';
var express = require('express')
, router = express.Router()
, upload = require('../config/upload')
, mongoose = require('mongoose')
, Media = mongoose.model('Media');

var onlyAdminVisiting = (req, res, next) => {
    if (!req.user.isAdmin) {
        res.sendStatus(403)
    }
}

router.get('/', function(req, res, next) {
    onlyAdminVisiting(req, res, next)
    Media.find({}).then(list => res.send(list)).catch(next);
})

router.post('/', upload.single('file'), function(req, res, next) {
    onlyAdminVisiting(req, res, next)
    var media = new Media({path: upload.relativePath(req.file)});
    media.save().then(doc => res.send(doc)).catch(next);
})

router.get('/:id', function(req, res, next) {
    Media.findById(req.params.id).then(media => res.send(media)).catch(next);
})

module.exports = router
