'use strict';

var Config = {
  db: 'mongodb://localhost/ce',
  port: 3000,
  uploadDir: 'uploads',
  username: 'admin',
  password: '111111',
  jwtsecret: '3t2424r23466y4f444rrt3444fu',
  /* wechat config: appid secret token encodingAESKey*/
  appId: 'wx4e3854267f1d0628',
  secret: '',
  token: '',
  encodingAESKey: '',
  baseUrl: 'http://192.168.199.5:3000'
}

module.exports = Config;
