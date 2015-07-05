/**
 * Created by GYX on 15/7/3.
 */
/**
 * Created by GYX on 15/7/3.
 */
/**
 * Created by lewiskit on 15/6/28.
 */
var ConfigProxy = require('../proxy').MailConfig;
var validator = require('validator');
var jwt = require('jsonwebtoken');

exports.login = function (req, res, next) {
    var username = validator.trim(req.body.username);
    var password = validator.trim(req.body.password);

    console.error(username + " " + password);

    UserProxy.findUserByName(username, function (err, user) {

        if (err) return next(err);

        console.log(user.toString());

        if (!user) {
            res.reply(101, "用户不存在");
            return;
        }

        if (user.password != password) {
            res.reply(101, "用户名或密码错误");
            return;
        }

        // create a token
        var token = jwt.sign(user, req.app.get('superSecret'), {
            expiresInMinutes: 1440 // expires in 24 hours
        });

        var data = {};
        data.username = user.username;
        data.role = user.role;
        data.token = token;

        res.reply(0, "success", data);

    });
};

exports.getMailConfig = function (req, res, next) {
    if (req.user.role != "admin") {
        res.reply(1, "没有权限");
        return;
    }
    ConfigProxy.getConfig(function (err, data) {
        if (err) next(err);

        data = JSON.parse(data);
        res.reply(0, "success", data);

    });

};

exports.setMailConfig = function (req, res, next) {

    var smtp = validator.trim(req.body.smtp);
    var smtpPort = validator.trim(req.body.smtpPort);
    var imap = validator.trim(req.body.imap);
    var imapPort = validator.trim(req.body.imapPort);
    var mailAddress = validator.trim(req.body.mailAddress);
    var password = validator.trim(req.body.password);


    if ((!smtp || smtp == "") || (!smtpPort || smtpPort == "")) {
        req.reply(104, "无法连接到smtp服务器");
        return;
    }
    if ((!imap || imap == "") || (!imapPort || imapPort == "")) {
        req.reply(103, "无法连接到imap服务器");
        return;
    }
    if ((!mailAddress || mailAddress == "") || (!password || password == "")) {
        req.reply(101, "邮箱名或密码不正确");
        return;
    }

    var config = {
        smtp: smtp,
        smtpPort: smtpPort,
        imap: imap,
        imapPort: imapPort,
        mailAddress: mailAddress,
        password: password
    };

    ConfigProxy.setConfig(config, function (err, message) {
        if (err) {
            if (err == 103 || err == 104) {
                res.reply(err, message);
            }
        }
        else {
            res.reply(0, "修改成功");
        }


    })
};

exports.setSetting = function (req, res, next) {


};