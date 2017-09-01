var express = require('express');
var router = express.Router();
var config = require('../config/config')
var only = require( 'only' );
var wxclient = require( '../config/wxclient' )
var mongoose = require('mongoose');
var Series = mongoose.model('Series')
var wxclient = require('../config/wxclient')

var config = {
  appid: config.appId
};

router.get('/authorize_url', (req, res, next) => {
  let url = wxclient.authClient.getAuthorizeURL(req.query.redirect_url, req.query.state, 'snsapi_userinfo')
  res.send({authorize_url: url})
})

router.post('/config', (req, res, next) => {
   wxclient.apiClient.getJsConfig({
    debug: !!req.body.debug,
    jsApiList: req.body.jsApiList,
    url: req.body.url
  }).then((params) => {
    res.send({params})
  }).catch(next)
})

router.post('/paynofify', wxclient.payClient.useWXCallback(function(msg, req, res, next){
  if( msg.sign !== wxPayclient.sign(msg) ) {
    res.fail()
  }
  console.log(msg)
  res.success();
}))

// router.get('/event', wechat(config, function (req, res, next) {
// }));

module.exports = router;
