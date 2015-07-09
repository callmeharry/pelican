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
                console.log(mail);

                var toPalaces = [];
                for (var i = 0; i < mail.to.length; i++) {
                    toPalaces.push(mail.to[i].name + " <" + mail.to[i].address + ">");
                }


                var sendMail = {
                    from: mail.from[0].name + ' <' + mail.from[0].address + '>',
                    html: mail.html,
                    text: mail.text,
                    subject: mail.subject,
                    to: toPalaces
                };

                if (mail.hasOwnProperty('attachment')) {
                    sendMail.attachment = mail.attachment;
                }

                var mailQueue = MailProxy.mailQueue;

                mailQueue.push({
                    name: sendMail.subject, run: function () {
                        var data = JSON.parse(arg2);


                        var mailInstance = new mailTool(data);


                        mailInstance.sendMail(sendMail, function (err, info) {
                            var status;
                            if (err) {
                                console.log("there is some err");
                                status = 'failed';
                            } else {
                                console.log("send email successfully");
                                status = 'send';
                            }

                            MailProxy.updateMailById(mail._id, {isChecked: status}, function (err) {
                                console.log('change status successfully');
                            });


                        });
                    }
                }, function (err) {
                    if (err)
                        console.log('hello is bad! %s', err);
                    else
                        console.log("The task execute successfully");

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
