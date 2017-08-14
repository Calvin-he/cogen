'use strict';

var Token = require('../models/token');
var OAuth = require('co-wechat-oauth');
var WechatAPI = require('co-wechat-api');
var Config = require('./config');



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

module.exports = {
  authClient,
  apiClient
}

