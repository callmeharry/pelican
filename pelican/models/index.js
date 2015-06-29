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

mongoose.connect(config.db, function (err) {
    if (err) {
        console.error('connect to %s error: ', config.db, err.message);
        process.exit(1);
    }

    console.log('connect to mongodb successfully');
 
});

//models
require("./user");
require("./mail");


exports.User = mongoose.model("User");
exports.Mail = mongoose.model("Mail");



