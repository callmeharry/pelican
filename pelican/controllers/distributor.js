/**
 * Created by VincentBel on 15/7/3.
 */

var MailProxy = require('../proxy').Mail;
var ROLE = require('../models/user').ROLE;
var validator = require('validator');

exports.getMailList = function (req, res, next) {
    if (req.user.role !== ROLE.DISTRIBUTOR) {
        res.reply(101, "邮件列表获取失败");
        return;
    }

    var page = req.query.page || 1;

    MailProxy.getAllMailList(page, function (err, results, pageCount, itemCount) {
        if (err) {
            next(err);
        } else {
            var data = {};
            data.page = pageCount;
            data.count = itemCount.length;
            data.items = results;

            res.reply(0, '邮件列表获取成功', data);
        }
    });
};


exports.distribute = function (req, res, next) {
    if (req.user.role !== ROLE.DISTRIBUTOR) {
        res.reply(101, "没有权限");
        return;
    }


    var mailId = validator.trim(req.body.mailId);
    var handlerId = validator.trim(req.body.handlerId);
    var readerIds = validator.trim(req.body.readerIds);

    MailProxy.updateMailById(mailId, {handler: handlerId, readers: readerIds, isDistributed: true}, function (err) {
        if (err) return next(err);
        res.reply(101, "邮件分发成功");

    });

};




