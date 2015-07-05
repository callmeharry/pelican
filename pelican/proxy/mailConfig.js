/**
 * Created by GYX on 15/7/3.
 */
var ConfigModel = require('../models').MailConfig;

var MailControl = require("../common/mail");

function getConfig(callback){


    ConfigModel.findOne({}, callback);

}

exports.getConfig =getConfig;

exports.setConfig =function(config,callback){

    var mailControl = new MailControl(config);
    mailControl.startSMTPConnection();

    //测试SMTP
    var mailOptions = {
        from: config.mailAddress, // sender address
        to: '450024927@qq.com', // list of receivers
        subject: 'Hello ', // Subject line
        text: 'Hello world ', // plaintext body
        html: '<b>Hello world </b>' // html body
    };
    var onerror =function(error, info){
        if(error){
            callback(104,"无法连接到smtp服务器");
            mailControl.stopSMTPConnection();
        }else{
            //测试IMAP
            mailControl.stopSMTPConnection();
            mailControl.imapTest(function(err,msg){
                if(err!=0) {
                    callback(err, msg);
                }
                else{
                    //修改数据库中的值
                    getConfig(function(err,data){
                        if(data){
                            data.update(config, {safe: true}, callback);

                        }
                        else if (config) {
                            var configModel = new ConfigModel();
                            configModel.save(config, callback);
                        }
                    });
                }
            });
        }
    };

    mailControl.sendMail(mailOptions,onerror);

};


