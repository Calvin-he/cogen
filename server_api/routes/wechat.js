var express = require('express');
var router = express.Router();
var config = require('../config/config')
var only = require( 'only' );
var wxclient = require( '../config/wxclient' )
var mongoose = require('mongoose');
var Series = mongoose.model('Series')
var Order = mongoose.model('Order')
var User = mongoose.model('User')
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

router.post('/paynotify', wxclient.payClient.useWXCallback(function(msg, req, res, next){
  if(msg.return_code !== 'SUCCESS' || msg.sign !==  wxclient.payClient.sign(msg)) {
    Order.findByIdAndUpdate(msg.out_trade_no, { 
        state: 'failed',
        transaction_id: msg.transaction_id,
        time_end: Date.now()
    }).then( () => {
      res.fail()
    })
  }
  Order.findById(msg.out_trade_no).then(order => {
    if(order.state === 'prepay') {
      Order.findByIdAndUpdate(msg.out_trade_no, { 
        state: 'success',
        transaction_id: msg.transaction_id,
        time_end: Date.now()
      }).exec()
      User.addPaidSeries(order.username, order.seriesId).then(() => {
        res.success()
      })   
    }
  })
}))

// router.get('/event', wechat(config, function (req, res, next) {
// }));

module.exports = router;
