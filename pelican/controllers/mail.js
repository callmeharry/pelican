/**
 * Created by lijie on 15/7/3.
 * 邮件controller 不分用户类型
 */
var MailModel = require('../proxy').Mail;
var UserModel = require('../proxy').User;
var validator = require('validator');
var ROLE = require('../models/user').ROLE;
var MailControl = require('../common/mail.js');
var MailConfig = require('../proxy').MailConfig;
var moment = require('moment');
var timeOffset = 28800000;//时区offset
/**
 * 获取单个邮件详情
 * @param req
 * @param res
 * @param next
 */
exports.getMailDetail = function (req, res, next) {
    var id = validator.trim(req.query.mailId);

    // 返回 handler 和 readers 的名称
    function addHandlersAndReadersName(mail, callback) {
        var ids = mail.readers.slice();
        ids.push(mail.handler);

        UserModel.findUsersByIds(ids, function (err, users) {
            if (err) {
                callback(err, mail);
            } else {
                var mailWithName = mail.toObject();

                mailWithName.readerNames = [];
                for (var i = 0; i < users.length; ++i) {
                    if (users[i]._id == mailWithName.handler) {
                        mailWithName.handlerName = users[i].username;
                    } else {
                        mailWithName.readerNames.push(users[i].username);
                    }
                }

                callback(null, mailWithName);
            }
        });
    }

    MailModel.findMailById(id, function (err, mail) {
        if (err) {
            res.reply(101, '获取失败');
            return;
        }
        if (!mail) {
            res.reply(101, '邮件不存在');
            return;
        }
        //判断是否有阅读权限
        if (req.user.role == ROLE.DISTRIBUTOR ||
            req.user._id == mail.handler ||
            mail.readers.indexOf(req.user._id) > -1 || req.user.role == ROLE.CHECKER) {

            if (mail.html != undefined || mail.text != undefined) {
                //将时间改为当前时区时间
                mail.date = moment(mail.date).valueOf() + timeOffset;
                mail.receivedDate = moment(mail.receivedDate).valueOf() + timeOffset;
                addHandlersAndReadersName(mail, function (err, data) {
                    if (data.attachments != undefined)
                        for (var i = 0; i < data.attachments.length; i++) {
                            delete data.attachments[i].content;
                        }
                    res.reply(0, 'success', data);
                });

            } else {
                //邮件里面没有正文进行下载

                MailConfig.getConfig(function (err, data) {
                    if (err) next(err);
                    data = JSON.parse(data);

                    var mailControl = new MailControl(data);

                    mailControl.getFullMail("INBOX", mail.messageId, function (fullMail) {

                        // 把 fullMail 中的属性加入到 mail 中
                        for (var attr in fullMail) {
                            if (fullMail.hasOwnProperty(attr)) {
                                mail[attr] = fullMail[attr];
                            }
                        }

                        //if (!mail.hasOwnProperty('html')) {
                        //    mail.html = mail.text;
                        //}

                        mail.save();

                        mail.save();
                        //将时间改为当前时区时间
                        mail.date = moment(mail.date).valueOf() + timeOffset;
                        mail.receivedDate = moment(mail.receivedDate).valueOf() + timeOffset;
                        if (data.attachments != undefined)
                            for (var i = 0; i < data.attachments.length; i++) {
                                delete data.attachments[i].content;
                            }
                        addHandlersAndReadersName(mail, function (err, data) {
                            res.reply(0, 'success', data);
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

