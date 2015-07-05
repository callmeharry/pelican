/**
 * Created by lijie on 15/7/3.
 * 邮件处理人员接口
 */
var validator = require('validator');
var MailProxy = require('../proxy').Mail;

exports.getEmailList = function(req, res ,next) {
    var id = validator.trim(req.user._id);
    var page = validator.trim(req.query.page);

    MailProxy.findHandlerNewMailList(id, page, false, function (err, results, pageCount, itemCount) {
        if(err) {
            res.reply(101, '获取邮件列表失败');
            return;
        }
        var data = {};
        data.pageCount = pageCount;
        var list = new Array();
        for(var i = 0; i < results.length; i++) {
            list[i] = {mailId:results[i]._id,
                title: results[i].subject,
                senderName: results[i].from,
                receiveTime:results[i].receivedDate};
        }
        data.list = list;
        res.reply(0,'success',data);
    });

};

exports.replyEmail = function(req, res, next) {
    var content = validator.trim(req.body.content);
    MailProxy.newAndSave(content, function (err, message) {
        if(err) {
            res.reply(101,'邮件未存储到数据库');
        } else {
            res.reply(0,'success');
        }
    });

    //TODO:发送邮件
};

/**
 * 处理邮件
 * @param req
 * @param res
 * @param next
 */
exports.manageEmail = function(req, res, next) {
    var mailId = req.body.mailId;
    MailProxy.handleMail(mailId, function(err) {
        if(err) {
            res.reply(101,'处理失败');
        } else {
            res.reply(0,'success');
        }
    })
};

exports.sendEmail = function(req, res, next) {
    var content = validator.trim(req.body.content);
    var receiver = req.body.receiver;
    var subject = req.body.title;
    MailProxy.createEmail(content, receiver, subject, function (err, message) {
        if(err) {
            res.reply(101,'邮件未存储到数据库');
        } else {
            res.reply(0,'success');
        }
    });

    //TODO:发送邮件
};

exports.getManagedEmailList = function (req, res, next) {

    var id = validator.trim(req.user._id);
    var page = validator.trim(req.query.page);

    MailProxy.findHandlerMailList(id, page, true, function (err, results, pageCount, itemCount) {
        if (err) {
            res.reply(101, '获取邮件列表失败');
            return;
        }
        var data = {};
        data.pageCount = pageCount;
        var list = new Array();
        for (var i = 0; i < results.length; i++) {
            list[i] = {
                mailId: results[i]._id,
                title: results[i].subject,
                senderName: results[i].from,
                receiveTime: results[i].receivedDate
            };
        }
        data.list = list;
        res.reply(0, 'success', data);
    });
}
