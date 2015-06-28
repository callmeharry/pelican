/**
 * Created by lewiskit on 15/6/28.
 * 配置mongodb 文件
 *
 */


var mongoose = require("mongoose");
var config = require("../config");

var mongodb_opts = {
    server: {
        socketOptions: {keepAlive: 1}, auto_reconnect: true, poolSize: config.db.conn_pool_size
    },

    user: config.db.user,
    pass: config.db.pass
};


var db_conn = mongoose.createConnection(config.db.host, config.db.db,
    config.db.port, mongodb_opts);

db_conn.on('connecting', function () {

    console.log('Mongodb server is connecting...');

}).on('connected', function () {

    console.log('Mongodb server has connected.');

}).on('reconnected', function () {

    console.log('Mongodb server has subsequently disconnected and successfully reconnected.');

}).on('error', function (err) {

    console.error('Connect to Mongodb[%s] error: %s', config.db.db, err.message);

    process.exit(1);
});


//models
require("./user");
//require("./mail");


exports.User = mongoose.model("User");
//exports.Mail = mongoose.model("mail");



