/**
 * Created by VincentBel on 15/7/3.
 */

var MailProxy = require('../proxy').Mail;
var MailTagProxy = require('../proxy').MailTag;
var ROLE = require('../models/user').ROLE;
var DISTRIBUTE_STATUS = require('../models/mail').DISTRIBUTE_STATUS;
var validator = require('validator');
var moment = require('moment');

exports.getMailList = function (req, res, next) {
    if (req.user.role !== ROLE.DISTRIBUTOR) {
        res.reply(101, "邮件列表获取失败");
        return;
    }

    var page = req.query.page || 1;
    var type = validator.trim(req.query.type) || DISTRIBUTE_STATUS.NEW;


    function callback(err, results, pageCount, itemCount) {
        if (err) {
            next(err);
        } else {
            var items = new Array(results.length);
            for (var i = 0; i < results.length; i++) {
                var item = {};
                item.date = results[i].date;
                item.fromNow = moment(results[i].date).locale('zh-cn').toNow();
                item._id = results[i]._id;
                item.subject = results[i].subject;
                item.messageId = results[i].messageId;
                item.from = results[i].from;
                item.distributeStatus = results[i].distributeStatus;
                items[i] = item;
            }

            var data = {};
            data.page = pageCount;
            data.pageCount = pageCount;
            data.count = itemCount.length;
            data.items = items;

            res.reply(0, '邮件列表获取成功', data);
        }
    }


    if (type == 'outdated') {
        MailProxy.getDistributorOutDatedMailList(page, callback);
    } else {

        // 判断type是否合法
        var isTypeValid = false;
        for (var property in DISTRIBUTE_STATUS) {
            if (DISTRIBUTE_STATUS.hasOwnProperty(property) && type == DISTRIBUTE_STATUS[property]) {
                isTypeValid = true;
                break;
            }
        }

        if (!isTypeValid) {
            // 若果type不合法，默认获取未分发的邮件
            type = DISTRIBUTE_STATUS.NEW;
        }

        MailProxy.getDistributorMailListByType(type, page, callback);
    }
};


exports.distribute = function (req, res, next) {
    if (req.user.role !== ROLE.DISTRIBUTOR) {
        res.reply(101, "没有权限");
        return;
    }


    var mailId = validator.trim(req.body.mailId);
    var handlerId = validator.trim(req.body.handlerId);
    var readerIds = validator.trim(req.body.readerIds);
    if (readerIds) {
        readerIds = JSON.parse(readerIds);
    }
    var handleDeadline = validator.trim(req.body.deadline);
    var reqTags = validator.trim(req.body.tags);
    if (reqTags) {
        reqTags = JSON.parse(reqTags);
    }

    MailTagProxy.findMailTagsByNames(reqTags, function (err, mailTags) {
        if (err) {
            return next(err);
        }

        var tags = [];
        for (var i = 0; i < mailTags.length; ++i) {
            tags.push(mailTags[i].name);
        }

        MailProxy.updateMailById(
            mailId,
            {
                handler: handlerId,
                readers: readerIds,
                distributeStatus: DISTRIBUTE_STATUS.DISTRIBUTED,
                handleDeadline: new Date(handleDeadline),
                tags: tags
            },
            function (err) {
                if (err) return next(err);
                res.reply(101, "邮件分发成功");

            }
        );
    });

};




