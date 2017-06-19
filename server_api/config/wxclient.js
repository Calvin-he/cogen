'use strict';

var Token = require('../models/token')
var OAuth = require('wechat-oauth');
var Config = require('./config')


var client = new OAuth(Config.appid, Config.secret, function (openid, callback) {

    // 传入一个根据openid获取对应的全局token的方法
    //   // 在getUser时会通过该方法来获取token
    Token.getToken(openid, callback);
}, function (openid, token, callback) {
    //       // 持久化时请注意，每个openid都对应一个唯一的token!
    Token.setToken(openid, token, callback);
});

module.exports = {
    authorizeURL: client.getAuthorizeURL(Config.baseUrl + "/auth"),
    authorizeURLForWebsite: client.getAuthorizeURLForWebsite(Config.redirectURL),
    getAccessToken: function(code, callback){
        client.getAccessToken(code, callback);
    },
    getUser: function(openId, callback){
        client.getUser(openId, callback);
    }
}

