var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var config = require('./config');
var Log = require('./common').LogHelper;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * 方便传输数据
 * 首先就做了关于status 和message 的解析
 */
app.use(function (req, res, next) {
    var startTime = Date.now();

    res.reply = function (status, message, data) {

        var rep = {
            apiVersion: config.apiVersion,
            status: status,
            message: message
        };

        if (data) {
            /**
            for (var index in data) {
                rep[index] = data[index];
            }
             **/
            rep['data'] = data;
        }

        res.jsonp(rep);
        res._content = rep;

        Log.d({req: req, res: res}, "Time used: %dms", Date.now() - startTime);
    };
    next();
});


app.use('/', routes);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    Log.e(err);
    res.reply(-1, "internal error");
});


module.exports = app;
