/**
 * Created by VincentBel on 15/7/3.
 */

var MailProxy = require('../proxy').Mail;
var ROLE = require('../models/user').ROLE;

var validator = require('validator');


exports.getMailList = function (req, res, next) {
    if (req.user.role !== ROLE.DISTRIBUTION) {
        res.reply(101, "邮件列表获取失败");
        return;
    }

    var page = req.query.page || 1;

    MailProxy.getAllMailList(page, function (err, results, pageCount, itemCount) {
        if (err) {
            next(err);
        } else {
            var data = {};
            data.count = itemCount;
            data.items = results;

            res.reply(0, '邮件列表获取成功', data);
        }
    });
};


exports.distribute = function (req, res, next) {
    if (req.user.role !== ROLE.DISTRIBUTION) {
        res.reply(101, "没有权限");
        return;
    }


    var mailId = validator.trim(req.body.mailId);
    var handlerId = validator.trim(req.body.hadlderId);
    var readerIds = validator.trim(req.body.readerIds);

    MailProxy.findMailById(mailId, function (err, mail) {
        if (err) {
            return next(err);
        }

        mail.handler = handlerId;
        mail.readers = readerIds;
        mail.save();

        // Todo 分发给处理人员和阅读人员

        res.reply(101, "邮件分发成功");
    });
};
