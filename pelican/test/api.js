/**
 * Created by lewiskit on 15/6/29.
 */



var proxy = require('../proxy');
var UserProxy = proxy.User;
var MailProxy = proxy.Mail;
var validator = require('validator');
var mailFs = require('../common/mailFs');
var moment = require('moment');


exports.testApi = function (req, res, next) {

    //var nowDate = Date.now();
    //
    //var receiveDate = moment();
    //
    //console.log({date:receiveDate.toLocaleString()});
    //
    //console.log()
    //
    //res.reply(0,"success");
    //

    var id = "559a674b0544dff55abc6a33";

     MailProxy.findMailById(id, function(err, mail){
         if (err) return next(err);

         if (mail) {
             var receivedDate = mail['receivedDate'];


             var time = moment(receivedDate);
             console.log(time.toLocaleString());

             var change = time.locale('zh-cn').toNow();


             console.log(change);

             res.reply(0, "success", mail);

         } else {
             res.reply(0, 'no such mail');
         }



    });
     **/
    //res.reply(0, "success");


    var content = {
        "smtp": "smtp.buaa.edu.cn",
        "smtpPort": "465",
        "imap": "mail.buaa.edu.cn",
        "imapPort": "993",
        "mailAddress": "gyxln@buaa.edu.cn",
        "password": "69568440"
    };


    mailFs.writeMailConfig(content, function (err) {
        if (err) return next(err);

        res.reply(0, 'success');

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