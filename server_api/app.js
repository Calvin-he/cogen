var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config/config');
var fs = require('fs');
var auth = require('./config/auth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
 // CookieParser should be above sessio
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(config.uploadDir));

fs.readdirSync('./models')
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(file => require('./models/' + file));

app.use(auth.basicAuth);

// cross domain middleware
app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
   res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,Cache-Control");
   if (req.method === 'OPTIONS') {
       res.statusCode = 204;
       return res.end();
   } else {
       return next();
   }
});

app.use('/lessons', require('./routes/lessons'));
app.use('/media', require('./routes/media'));
app.use('/series', require('./routes/series'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(res.locals);
});

mongoose.Promise = require('bluebird');

function connectDB () {
    var options = { server: { socketOptions: { keepAlive: 1 } } };
    return mongoose.connect(config.db, options).connection;
}

connectDB()
    .on('error', console.log)
    .on('disconnected', connectDB)
    .once('open', listen)

function listen(){
    app.listen(config.port, function () {
        console.log(`App listening on port ${config.port}!`)
    })
}
