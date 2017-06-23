var express = require('express');
var router = express.Router();
var config = require('../config/config')
var wechat = require('wechat')

var config = {
  appid: config.appId,
  token: config.token,
  encodingAESKey: config.encodingAESKey,
  checkSignature: true 
};


router.get('/event', wechat(config, function (req, res, next) {
}));

module.exports = router;
