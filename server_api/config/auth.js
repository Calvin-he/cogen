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
                    res.send(err);
                }else{
                    res.send({user: {openid: result.data.openid}, token: result.data.openid, data: result.data});
                }
            });
        }else if(req.query.origin === 'cogen'){
            if(req.query.username  === config.username && req.query.password === config.password){
                res.send({token: req.query.username});
            }else{
                res.sendStatus(401);
            }
        }else{
            res.sendStatus(404);
        }
    }else{
        var userId = req.header('Authorization');
        if(userId){
            var isAdmin = userId === config.username
                req.user = {isAdmin: isAdmin, id: userId};
            next();
        }else{
            //res.redirect(wxclient.authorizeURL);
            //basicAuth(req, res, next)
            res.sendStatus(401);
        }
    }
}

