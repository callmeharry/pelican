/**
 * Created by VincentBel on 15/7/3.
 */

var MailProxy = require('../proxy').Mail;
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

    var query = {};

    function callback(err, results, pageCount, itemCount) {
        if (err) {
            next(err);
        } else {
            var re=results;
            for(var i=0;i<re.length;i++){
                var d = re[i].date;
                re[i].date=moment(d).locale('zh-cn').toNow();
            }
            var data = {};
            data.page = pageCount;
            data.pageCount = pageCount;
            data.count = itemCount.length;
            data.items = re;

            res.reply(0, '邮件列表获取成功', data);
        }
    }


    if (type == 'outdated') {
        MailProxy.getDistributorOutDatedMailList(page, callback);
    } else {
        if (!DISTRIBUTE_STATUS.hasOwnProperty(type)) {
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
    var handleDeadline = validator.trim(req.body.deadline);

    MailProxy.updateMailById(
        mailId,
        {
            handler: handlerId,
            readers: readerIds,
            distributeStatus: DISTRIBUTE_STATUS.DISTRIBUTED,
            handleDeadline: new Date(handleDeadline)
        },
        function (err) {
        if (err) return next(err);
        res.reply(101, "邮件分发成功");

    });

};




