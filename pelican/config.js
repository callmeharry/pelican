/**
 * Created by lewiskit on 15/6/28.
 * store static configuration
 */


var config = {

    //API version
    apiVersion: "0.1",

    //mongodb 数据库配置
    db: "mongodb://pelican:Pelican1221@123.57.211.52:27017/pelican",

    //logFile path
    log: {
        "out": "/var/log/pelican/out.log",
        "err": "/var/log/pelican/err.log"
    }
};

module.exports = config;