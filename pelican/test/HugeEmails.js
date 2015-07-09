/**
 * Created by lijie on 15/7/8.
 */
var MailModel = require('../models').Mail;
var MailSender = require('../common/mail');
var MailProxy = require('../proxy').Mail;
var eventproxy = require('eventproxy');
var DISTRIBUTE_STATUS = require('../models/mail').DISTRIBUTE_STATUS;
var mailCount = 100;//default mailCount for each handler;
var success = 0;
var failure = 0;
var done = 0;
var ep = new eventproxy();
var interval;
var handlerIds = ['559e144906efc76ba79f0fda', '559e145106efc76ba79f0fdb', '559e147b06efc76ba79f0fdc',
    '559e148406efc76ba79f0fdd', '559e148c06efc76ba79f0fde', '559e149006efc76ba79f0fdf',
    '559e149b06efc76ba79f0fe0', '559e14a106efc76ba79f0fe1', '559e14a706efc76ba79f0fe2', '559e14b006efc76ba79f0fe3'
];

ep.after('send', mailCount * handlerIds.length, function (infos) {
    console.log(mailCount * handlerIds.length + ' attempts, success:' + success + ', failure:' + failure);
});

//sendOneEmail();

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

exports.saveMails = function () {
    interval = setInterval(saveMail, 1000);
};


function saveMail() {
    for (var x = 0; x < handlerIds.length; x++) {
            var mail = new MailModel();
            var date = new Date();
        mail.handler = handlerIds[x].toString();
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
    done += handlerIds.length;
    console.log(done + ' attempts done.');
    if (done >= mailCount * handlerIds.length)
        clearInterval(interval);
}