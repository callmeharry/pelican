/**
 * Created by VincentBel on 15/7/3.
 */

var MailProxy = require('../proxy').Mail;
var ROLE = require('../models/user').ROLE;


exports.getMailList = function (req, res, next) {
    if (req.user.role !== ROLE.DISTRIBUTION) {
        res.reply();
        return;
    }

    var page = req.query.page;

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

