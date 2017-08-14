'use strict';

var mongoose = require('mongoose');

var TokenSchema = new mongoose.Schema({
    access_token: String,
    expires_in: Number,
    refresh_token: String,
    openid: {type: String, unique: true},
    scope: String,
    create_at: String
});

TokenSchema.statics.getToken = function (openid, cb) {
    this.findOne({openid:openid}, function (err, result) {
        if (err) throw err;
        return cb(null, result);
    });
};

TokenSchema.statics.setToken = function (openid, token, cb) {
    // 有则更新，无则添加
    var query = {openid: openid};
    var options = {upsert: true};
    this.update(query, token, options, function (err, result) {
        if (err) throw err;
        return cb(null);
    });
};

var Token = mongoose.model('Token', TokenSchema);

module.exports = Token;
