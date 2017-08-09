var express = require('express');
var router = express.Router();
var config = require('../config/config')
var wechat = require('wechat')
var only = require( 'only' );
var wxauthclient = require( '../config/wxclient' )

var config = {
  appid: config.appId
};

router.get('/authorize_url', (req, res, next) => {
  let url = wxauthclient.getAuthorizeURL(req.query.redirect_url, req.query.state, 'snsapi_userinfo')
  res.send({authorize_url: url})
})

router.get('/event', wechat(config, function (req, res, next) {
}));

module.exports = router;
