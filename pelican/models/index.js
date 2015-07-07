/**
 * Created by lewiskit on 15/6/28.
 * 配置mongodb 文件
 *
 */


var mongoose = require("mongoose");
var config = require("../config");



/**
var db_conn = mongoose.createConnection(config.db.host, config.db.db,
    config.db.port, mongodb_opts);
 */
var opts = {
    server: {
        socketOptions: {keepAlive: 1},
        auto_reconnect: true, poolSize: 25
    }
};

mongoose.connect(config.db, opts, function (err) {
    if (err) {
        console.error('connect to %s error: ', config.db, err.message);
        process.exit(1);
    }

    console.log('connect to mongodb successfully');
 
});

//models
require("./user");
require("./mail");
require("./mailTag");

exports.User = mongoose.model("User");
exports.Mail = mongoose.model("Mail");
exports.MailTag = mongoose.model("MailTag");


