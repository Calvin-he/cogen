'use strict';

const express = require('express'),
    router = express.Router(),
    multer = require('multer'),
    fs = require('fs'),
    path = require('path'),
    config = require('./config');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var uploadDir = path.resolve(config.mediaDir, 'uploads');
        if(!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        var date = new Date();
        uploadDir = path.join(uploadDir, date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate());
        if(!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        var date = new Date();
        var filename = date.getTime() + "-" + file.originalname;
        cb(null, filename)
    }
})

var upload = multer({
    storage: storage,
    limits: {fieldSize: 1000000 * 10, files:1 }
})

upload.relativePath = function(file) {
    let prefixPath = path.resolve(config.mediaDir)
    let filepath = file.path.replace(prefixPath, '/media');
    return filepath.replace(/\\/g, '/')
}

module.exports = upload;
