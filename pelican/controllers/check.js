/**
 * Created by lewiskit on 15/7/7.
 * 邮件审核
 */

var proxy = require('../proxy');
var MailProxy = proxy.Mail;
var moment = require('moment');
var validator = require('validator');
var async = require('async');
var mailTool = require('../common/mail');
var mailConfig = proxy.MailConfig;



exports.getUnCheckList = function (req, res, next) {
    var user = req.user;
    var page = req.query.page;

    var query = {checkMan: user._id, isChecked: 'unchecked'};

    MailProxy.getCheckMailList(query, page, function (err, results, pageCount, itemCount) {
        if (err) return next(err);

        if (!results) {
            res.reply(101, '没有邮件');
            return;
        }

        var data = {};
        data['pageCount'] = pageCount;

        var list = [];
        console.log(results);
        for (var i = 0; i < results.length; i++) {
            var item = results[i];

            console.log(item);
            list.push({
                mailId: item._id,
                title: item.subject,
                receiver: item.to,
                receiveTime: item.date,
                fromNow: moment(item.date).locale('zh-cn').toNow()
            });
        }
        data.list = list;

        res.reply(0, 'success', data);

    });

};

exports.getCheckedList = function (req, res, next) {
    var user = req.user;
    var page = req.query.page;

    var query = {checkMan: user._id, isChecked: {"$in": ['checked', 'returned']}};

    MailProxy.getCheckMailList(query, page, function (err, results, pageCount, itemCount) {
        if (err) return next(err);


        if (!results) {
            res.reply(101, '没有邮件');
            return;
        }
        console.log(results);
        var data = {};
        data['pageCount'] = pageCount;

        var list = [];

        for (var i = 0; i < results.length; i++) {

            var item = results[i];

            list.push({
                mailId: item._id,
                title: item.subject,
                receiver: item.to,
                receiveTime: item.date,
                fromNow: moment(item.date).locale('zh-cn').toNow(),
                isChecked: item.isChecked
            });
        }

        data.list = list;

        res.reply(0, 'success', data);
    });

};

exports.setCheckStatus = function (req, res, next) {
    var mailId = req.body.mailId;
    var check = req.body.check;

    if (check == 'passed') {  //审核通过
        async.waterfall([

            function (callback) {

                MailProxy.findMailById(mailId, function (err, mail) {
                    if (err) return callback(err);

                    mail.isChecked = 'checked';
                    mail.save();

                    callback(null, JSON.stringify(mail));
                });

            },

            function (arg1, callback) {


                mailConfig.getConfig(function (err, data) {
                    if (err) return callback(err);
                    console.log(JSON.parse(data));
                    callback(null, arg1, data);
                });
            },

            function (arg1, arg2, callback) {

                var mail = JSON.parse(arg1);
                mail = {
                    from: mail.from,
                    to: mail.to,
                    html: mail.html,
                    text: mail.text,
                    attachment: mail.attachment,
                    subject: mail.subject
                };


                var mailQueue = MailProxy.mailQueue;


                console.log("before sending is ok!");
                console.log(mail);
                console.log("the config");
                console.log(arg2);

                mailQueue.push({
                    name: mail.subject, run: function () {
                        var data = JSON.parse(arg2);

                        var mailInstance = new mailTool(data);

                        mailInstance.sendMail(mail, function (err, info) {
                            if (err) return callback(err);

                            console.log(info);
                            console.log("send email successfully");

                        });
                    }
                });

                callback(null, 'done');

            }

        ], function (err, result) {
            if (err) return next(err);

            console.log(result);

            res.reply(0, '发送成功');
        });

    } else if (check == 'failed') {    //审核未通过

        var checkContent = validator.trim(req.body.checkContent) || '';

        var ups = {isChecked: "returned"};

        if (checkContent) ups['checkContent'] = checkContent;


        MailProxy.updateMailById(mailId, ups, function (err) {
            if (err) return next(err);
            res.reply(0, '退回成功');

        });

    }

};
