var express = require('express');
var router = express.Router();
var wxclient = require('../config/wxclient')

/* GET users listing. */
router.get('/', (req, res, next) => {
    wxclient.getAccessToken(req.query.code, function(err, result){
        if(err){
            console.log("err:", err);
            res.send(err);
        }else{
            res.send({user: {openid: result.data.openid}, token: result.data.openid});
        }
    });

});


module.exports = router;
