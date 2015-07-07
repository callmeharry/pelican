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


exports.addMailTag = function (req, res, next) {
    if (req.user.role !== ROLE.DISTRIBUTOR) {
        res.reply(101, "没有权限");
        return;
    }

    var tagName = validator.trim(req.body.tagName);

    MailTagProxy.findMailTagByName(tagName, function (err, mailTag) {
        if (err) {
            return next(err);
        }

        if (mailTag) {
            res.reply(101, "邮件标签已存在");
            return;
        }

        MailTagProxy.newAndSave(tagName, function (err, mailTag) {
            if (err) {
                return next(err);
            }

            var data = {};
            data.id = mailTag._id;
            data.tagName = mailTag.name;
            res.reply(0, "添加成功", data);
        });
    });

};