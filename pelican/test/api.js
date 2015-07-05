/**
 * Created by lewiskit on 15/6/29.
 */



var proxy = require('../proxy');
var UserProxy = proxy.User;
var MailProxy = proxy.Mail;
var validator = require('validator');
var mailFs = require('../common/mailFs');


exports.testApi = function (req, res, next) {

    mailFs.writeMailConfig({host: "www.baidu.com", name: "hello world"}, function (err) {
        if (err) return next(err);

        console.log("success");
        res.reply(0, "success");

    });

    //
    //mailFs.readMailConfig(function(err, data){
    //
    //    if(err) return next(err);
    //
    //
    //    var content = JSON.parse(data);
    //
    //    res.reply(0,"success",content);
    //
    //});
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