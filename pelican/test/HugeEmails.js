/**
 * Created by lijie on 15/7/8.
 */
var MailModel = require('../models').Mail;
var MailSender = require('../')
var mailIndex = 1;
var mailCount = 2;


function sendOneEmail(callback) {
    var mailOptions = {
        from: 'cmhsteveli@163.com', // sender address
        to: '450024927@qq.com', // list of receivers
        subject: '第' + mailIndex + '封测试邮件', // Subject line
        text: 'Hello world ', // plaintext body
        html: '<b>Hello world </b>' // html body
    };
}