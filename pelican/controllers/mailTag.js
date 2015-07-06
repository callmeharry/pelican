/**
 * Created by VincentBel on 15/7/6.
 */

var MailTagProxy = require('../proxy').MailTag;
var ROLE = require('../models/user').ROLE;
var validator = require('validator');

exports.getAllMailTags = function (req, res, next) {
    if (req.user.role !== ROLE.DISTRIBUTOR) {
        res.reply(1, "没有权限");
        return;
    }

    MailTagProxy.findAllMailTags(function (err, results) {
        if (err) {
            next(err);
        } else {
            var data = {};
            data.count = results.length;
            data.tags = results;

            res.reply(0, '获取成功', data);
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