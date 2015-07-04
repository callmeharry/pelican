/**
 * Created by lewiskit on 15/6/29.
 */



var proxy = require('../proxy');
var UserProxy = proxy.User;
var MailProxy = proxy.Mail;
var validator = require('validator');

exports.testApi = function (req, res, next) {
    var username = validator.trim(req.body.username);
    var password = validator.trim(req.body.password);


    UserProxy.newAndSave(username, password, 3, function (err, user) {

        if (err) return next(err);

        res.reply(0, "success", user);


    });

};

exports.testMail = function (req, res, next) {
    var mailContent = {
        html: '<div style="font:14px/1.5 \'Lucida Grande\', \'微软雅黑\';color:#333;"><p style="font:14px/1.5 \'Lucida Grande\';margin:0;"><br></p><br><div><div style="font: 14px/1.5 \'Lucida Grande\';">hi</div></div></div>',
        subject: 'hi',
        priority: 'normal',
        from: [{address: 'gyxln@buaa.edu.cn', name: 'gyxln'}],
        to: [{address: 'gyxln@buaa.edu.cn', name: 'gyxln'},
            {address: '450024927@qq.com', name: '450024927'}],
        date: Date.now(),
        isDistribute: true,
        handler: '559693a96c6456be45d9d74a'
    };

    MailProxy.newAndSave(mailContent, function (err, mail) {

        if (err) return next(err);

        res.reply(0, "message", mail);
    });


};