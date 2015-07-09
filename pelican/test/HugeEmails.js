/**
 * Created by lijie on 15/7/8.
 */
var MailModel = require('../models').Mail;
var MailSender = require('../common/mail');
var MailProxy = require('../proxy').Mail;
var eventproxy = require('eventproxy');
var DISTRIBUTE_STATUS = require('../models/mail').DISTRIBUTE_STATUS;
var mailCount = 2;//default mailCount for each handler;
var success = 0;
var failure = 0;
var ep = new eventproxy();
var handlerIds = [];

ep.after('send', mailCount, function (infos) {
    console.log(mailCount + ' attempts, success:' + success + ', failure:' + failure);
});

//sendOneEmail();
saveMail();

function sendOneEmail() {
    for (var i = 0; i < mailCount; i++) {
        var date = new Date();
        var mailOptions = {
            from: '522919608@qq.com', // sender address
            to: 'pelicanfly@163.com', // list of receivers
            subject: '测试邮件(自动生成于' + date + ')', // Subject line
            text: '测试邮件(自动生成于' + date + ')', // plaintext body
            html: '<b>测试邮件(自动生成于' + date + ') </b>' // html body
        };
        var config = {
            smtp: 'smtp.qq.com',
            smtpPort: '465',
            imap: 'imap.qq.com',
            imapPort: '993',
            mailAddress: '522919608@qq.com',
            password: 'syzn65580'
        };

        var mailSender = new MailSender(config);

        mailSender.sendMail(mailOptions, function (err, info) {
            if (!err) {
                success++;
                ep.emit('send', info);
            } else {
                failure++;
                ep.emit('send', err);
            }
        });
    }
}

function saveMail() {
    for (var x = 0; x < handlerIds.length; x++) {
        for (var i = 0; i < mailCount; i++) {
            var mail = new MailModel();
            var date = new Date();
            mail.handler = handlerIds[x];
            mail.subject = '测试邮件(自动生成于' + date + ')';
            mail.text = '测试邮件(自动生成于' + date + ')'; // plaintext body
            mail.html = '<b>测试邮件(自动生成于' + date + ') </b>';
            mail.from = {name: 'steve', address: '442500347@qq.com'};
            mail.checkMan = '';
            mail.distributeStatus = DISTRIBUTE_STATUS.DISTRIBUTED;
            mail.messageId = Date.now().toLocaleString() + '@pelican';
            mail.to = [{name: '鹈鹕邮件', address: 'gyxln@buaa.edu.cn'}];
            mail.isHandled = false;
            MailProxy.newAndSave(mail, function (err, data2) {
                if (err) {
                    failure++;
                    ep.emit('send', err);
                } else {
                    success++;
                    ep.emit('send', data2);
                }
            });
        }
    }
}