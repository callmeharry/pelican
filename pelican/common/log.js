var bunyan = require('bunyan');
var path = require('path');
var config = require('../config');
var os = require('os');

var LogPath = os.platform() == 'win32' ?
    path.join(__dirname, '..', 'Log', 'Out.log') :
    config.log.out;

var ErrPath = os.platform() == 'win32' ?
    path.join(__dirname, '..', 'Log', 'Error.log') :
    config.log.err;

var Logger = bunyan.createLogger({
    name: 'pelican server',
    streams: [{
        stream: process.stdout,
        level: 'trace'
    }, {
        path: LogPath,
        type: 'file',
        level: 'trace'
    }, {
        path: ErrPath,
        type: 'file',
        level: 'error'
    }],
    serializers: {
        req: function (req) {
            return {
                method: req.method,
                url: req.url,
                headers: req.headers,
                remoteAddress: req.ip,
                query: req.query || '',
                body: req.body || ''
            };
        },
        res: function (res) {
            return {
                status: res._content.status,
                message: res._content.message
            };
        }
    }
});

var LoggerS = Logger.child({src: true});

exports.d = function () {
    Logger.info.apply(Logger, arguments);
};
exports.e = function () {
    LoggerS.error.apply(LoggerS, arguments);
};