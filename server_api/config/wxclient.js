'use strict';

var Token = require('../models/token');
var OAuth = require('co-wechat-oauth');
var WechatAPI = require('co-wechat-api');
var Config = require('./config');
var fs = require('fs')



var authClient = new OAuth(Config.appId, Config.secret);


var accessToken, jsapiTicket
var apiClient = new WechatAPI(Config.appId, Config.secret, async function () {
  return accessToken
}, async function (token) {
  console.debug('Access token: ' + token)
  accessToken = token
});

apiClient.registerTicketHandle(async function (type) {
  return jsapiTicket
}, async function (type, ticket) {
  console.debug('JS API Ticket: ' + ticket)
  jsapiTicket = ticket
});

var WXPay = require('weixin-pay');

var initConfig = {
  appid: Config.appId,
  mch_id: Config.mchId,
  partner_key: Config.mchApiKey,
  pfx: Config.mchCertPath && fs.readFileSync(Config.mchCertPath)
};
var payClient = new WXPay(initConfig);

module.exports = {
  authClient,
  apiClient,
  payClient
}

