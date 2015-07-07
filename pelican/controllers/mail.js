/**
 * Created by lijie on 15/7/3.
 * 邮件controller 不分用户类型
 */
var MailModel = require('../proxy').Mail;
var validator = require('validator');
var ROLE = require('../models/user').ROLE;
var MailControl = require('../common/mail.js');
var MailConfig = require('../proxy').MailConfig;
var moment = require('moment');
/**
 * 获取单个邮件详情
 * @param req
 * @param res
 * @param next
 */
exports.getMailDetail = function(req, res, next) {
    var id = validator.trim(req.query.mailId);

    MailModel.findMailById(id, function (err, mail) {
        if(err) {
            res.reply(101, '获取失败');
            return;
        }
        if(!mail) {
            res.reply(101,'邮件不存在');
            return;
        }

        //判断是否有阅读权限
        if (req.user.role == ROLE.DISTRIBUTOR ||
            req.user._id == mail.handler ||
            mail.readers.indexOf(req.user._id) || req.user.role == ROLE.CHECKER) {


            if (!mail.html && !mail.text) {
                res.reply(0, 'success', mail);


            } else {


                //邮件里面没有正文进行下载

                MailConfig.getConfig(function (err, data) {
                    if (err) next(err);
                    data = JSON.parse(data);

                    var mailControl = new MailControl(data);

                    mailControl.getFullMail("INBOX", mail.messageId, function (mail) {
                        mail.date=moment(mail.date).locale('zh-cn').toNow();
                        res.reply(0, 'success', mail);
                        MailModel.updateMailById(id, mail, function (err) {
                            if (err)
                                console.log(err);
                        });
                    }, function (err) {
                        if (err)
                            res.reply(101, '获取失败');
                    });

                });

                console.log(mail['']);


            }


        } else {
            res.reply(101, '没有权限');
        }

    });

};