'use strict';

var Token = require('../models/token');
var OAuth = require('co-wechat-oauth');
var Config = require('./config');



var client = new OAuth(Config.appId, Config.secret);

module.exports = client

// // save openid in cookie
// function auth(app){
//     app.use(session({
//         secret: 'abcdefg123456',
//         resave: false,
//         saveUninitialized: true
//     }))
//     app.use(function(req, res, next){
//         if(req.path.startsWith("/auth")){
//             console.log("code", req.query.code);
//             wxclient.getAccessToken(req.query.code, function(err, result){
//                 if(err){
//                     console.log("err:", err);
//                 }else{
//                     req.session.openid = result.data.openid;
//                     res.redirect(req.session.savedPath);
//                 }
//             });
//         } else {
//             console.log("session:", req.session);
//             console.log("session.openid:", req.session.openid);
//             var openid = req.session.openid;
//             if(!openid){
//                 req.session.savedPath = req.path;
//                 console.log("authorizeURL: ", wxclient.authorizeURL);
//                 res.redirect(wxclient.authorizeURL);
//             }else{
//                 next();
//             }
//         }
//     });

// }
