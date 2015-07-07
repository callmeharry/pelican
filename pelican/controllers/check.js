/**
 * Created by lewiskit on 15/7/7.
 * 邮件审核
 */

var proxy = require('../proxy');
var MailProxy = proxy.Mail;
var moment = require('moment');
var validator = require('validator');


exports.getUnCheckList = function (req, res, next) {
    var user = req.user;
    var page = req.query.page;

    var query = {checkMan: user._id, isHandled: true, isChecked: 'unchecked'};

    MailProxy.getCheckMailList(query, page, function (err, results, pageCount, itemCount) {
        if (err) return next(err);

        if (!results) {
            res.reply(101, '没有邮件');
            return;
        }

        var data = {};
        data['pageCount'] = pageCount;

        var list = [];

        for (var item in results) {
            list.push({
                mailId: item._id,
                title: item.subject,
                senderName: item.from,
                receiveTime: item.receivedDate,
                fromNow: moment(results[i].receivedDate).locale('zh-cn').toNow()
            });
        }
        data.list = list;

        res.reply(0, 'success', data);

    });

};

exports.getCheckedList = function (req, res, next) {
    var user = req.user;
    var page = req.query.page;

    var query = {checkMan: user._id, isHanded: true, isChecked: {"$in": ['checked', 'returned']}};

    MailProxy.getCheckMailList(query, page, function (err, results, pageCount, itemCount) {
        if (err) return next(err);


        if (!results) {
            res.reply(101, '没有邮件');
            return;
        }

        var data = {};
        data['pageCount'] = pageCount;

        var list = [];

        for (var item in results) {
            list.push({
                mailId: item._id,
                title: item.subject,
                receiveName: item.from,
                receiveTime: item.receivedDate,
                fromNow: moment(results[i].receivedDate).locale('zh-cn').toNow()
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
        MailProxy.updateMailById(mailId, {isChecked: "checked"}, function (err) {
            if (err) return next(err);

            //todo 发送邮件

            res.reply(0, "发送成功")

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
