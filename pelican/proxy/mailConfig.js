/**
 * Created by GYX on 15/7/3.
 */

var MailControl = require("../common/mail");

var mailFs = require('../common/mailFs');

var Mail = require("../proxy").Mail;



function getConfig(callback) {

        mailFs.readMailConfig(callback);

}

exports.getConfig= getConfig;

exports.setConfig =function(config,callback) {

    var mailControl = new MailControl(config);

    //测试SMTP
    var mailOptions = {
        from: config.mailAddress, // sender address
        to: '450024927@qq.com', // list of receivers
        subject: 'Hello ', // Subject line
        text: 'Hello world ', // plaintext body
        html: '<b>Hello world </b>' // html body
    };
    var onerror = function (error, info) {
        if (error) {
            callback(104, "无法连接到smtp服务器");
            mailControl.stopSMTPConnection();
        } else {
            //测试IMAP
            mailControl.stopSMTPConnection();
            mailControl.imapTest(function (err, msg) {
                if (err != 0) {
                    callback(err, msg);
                }
                else {
                    //getConfig(function(err,data){
                    //    if(data!=config){
                            mailFs.writeMailConfig(config, function (err) {
                                if (err) callback(-1, "internal error");

                                callback(0, 'success');
                                Mail.clear();
                                mailControl.openBox("INBOX", ["ALL"], function (mail) {
                                    //console.log(mail);
                                    Mail.newAndSave(mail, function (err) {
                                        console.log(err);
                                    });
                                },function(err){
                                    // console.log(err);
                                });

                            });
                    //    }
                    //});

                }
            });
        }
    };

    mailControl.sendMail(mailOptions,onerror);
};




//定时获取邮件
//两分钟一次

var timmer=null;
function getOriginMail() {
    if(!timmer) {
        timmer = setInterval(function () {
            var now = new Date();
            var since = new Date(Date.parse(now)-120000);
            getConfig(function (err, data) {
                console.log("start to listening mail");
                if (data) {
                    data = JSON.parse(data);
                    var mailControl = new MailControl(data);

                    console.log('setInterval called');

                    mailControl.openBox("INBOX", [["SINCE",since]], function (mail) {
                        Mail.newAndSave(mail, function (err) {
                            if (err) return next(err);
                            console.log("save new mail success");
                        });
                    },function(error){
                        console.log(error);
                    });

                }
            });
        }, 120000);
    }
}


exports.getOriginMail = getOriginMail();