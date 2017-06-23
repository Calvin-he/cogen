var express = require('express');
var router = express.Router();
var config = require('../config/config')

router.get('/', (req, res, next) => {
   res.send({
    appId: config.appId,
  })
})

module.exports = router