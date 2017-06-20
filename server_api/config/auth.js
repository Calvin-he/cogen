var basicAuth0 = require('basic-auth');
var config = require('./config');
var wxclient = require('./wxclient');

var basicAuth = function(req, response, next) {

    function unauthorized(response) {
        response.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return response.sendStatus(401);
    };
    var user = basicAuth0(req);

    if (!user || !user.name || !user.pass) {
        return unauthorized(response);
    };

    if (user.name === config.username && user.pass === config.password) {
        req.user.isAdmin = true;
        return next();
    } else {
        return unauthorized(response);
    };

};

module.exports = function(req, res, next){
    if(req.path.startsWith("/auth")){
        if(req.query.origin === 'wechat'){
            wxclient.getAccessToken(req.query.code, function(err, result){
                if(err){
                    console.log("err:", err);
                    res.send(err);
                }else{
                    res.send({user: {openid: result.data.openid}, token: result.data.openid, data: result.data});
                }
            });
        }else {
            basicAuth(req, res, next)
        }
    }else{
        req.user = {isAdmin: false};
        var userId = req.header('Authorization');
        if(userId){
            req.user.id = userId;
            next();
        }else{
            //res.redirect(wxclient.authorizeURL);
            basicAuth(req, res, next)
        }
    }
}

