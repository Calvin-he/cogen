'use strict';

var express = require('express');
var router = express.Router();
var multer = require('multer');
var config = require('./config');
var fs = require('fs');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var uploadDir = config.uploadDir + '/uploads';
        if(!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        var date = new Date();
        var day = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
        var path = uploadDir + "/" + day;
        if(!fs.existsSync(path)){
            fs.mkdirSync(path);
        }
        cb(null, path)
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
    var filepath = file.path.replace(config.uploadDir, '');
    return filepath.replace(/\\/g, '/')
}

module.exports = upload;
