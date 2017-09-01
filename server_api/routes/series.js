var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var only = require('only');
var wxPayclient = require('../config/wxclient').payClient
var Series = mongoose.model('Series');
var Lesson = mongoose.model('Lesson');
var Media = mongoose.model('Media');
var Order = mongoose.model('Order')



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
      Lesson.find({_id : {$in: lessonIds}}, '_id, title mediaPath mediaPath2').then(lessons => {
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

router.get('/:id/wxpay', async (req, res, next) => {
  let series = await Series.findById(req.params.id)
  var orderParams = {
    body: series.title,
    attach: `{"seriesId": "${series.seriesId}"}`,
    out_trade_no: Date.now().toString() + Math.floor(Math.random()*1e10),
    total_fee: series.price * 100,
    spbill_create_ip: req.ip,
    openid: req.user.username, //username is openid
    notify_url: "http://www.rzyyx.cn/cogen/wechat/api/1.0/wechat/paynotify"
  }
  wxPayclient.getBrandWCPayRequestParams(orderParams, (err, payargs) => {
    if(!err) {
      let order = new Order({
        _id: orderParams.out_trade_no,
        username: req.user.username,
        seriesId: series._id,
        fee: series.price,
        state: 'prepay'
      })
      order.save().then(() => {
        res.send(payargs)
      }).catch((err) => {
        console.log(err)
        next(err)
      })
    } else {
      res.send(400, err)
    }
  })
})


module.exports = router;
