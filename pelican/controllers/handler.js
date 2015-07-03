/**
 * Created by lijie on 15/7/3.
 * 邮件处理人员接口
 */
var validator = require('validator');
var MailProxy = require('../proxy').Mail;

exports.getEmailList = function(req, res ,next) {
    var id = validator.trim(req.user);
    var page = validator.trim(req.body.page);

    MailProxy.findHandlerNewMailList(id,page, function(err, results, pageCount, itemCount) {
        if(err) {
            res.reply(101, '获取邮件列表失败');
            return;
        }
        var data = {};
        data.pageCount = pageCount;
        var list = new Array();
        for(var i = 0; i < data.length; i++) {
            list[i] = {mailId:data.messageId,
                title: data.subject,
                senderName: data.from.name,
                receiveTime:data.receiveTime};
        }
        data.list = list;
        res.reply(0,'success',data);
    });

};

exports.replyEmail = function(req, res, next) {
    var content = req.body.content;
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
            res.reply(101,"")
        }
    })
};

exports.sendEmail = function(res, res, next) {
    var content = res.body.content;
    var receiver = res.body.receiver;
    var subject = res.body.title;
    MailProxy.newAndSave(content, function (err, message) {
        if(err) {
            res.reply(101,'邮件未存储到数据库');
        } else {
            res.reply(0,'success');
        }
    });

    //TODO:发送邮件
};