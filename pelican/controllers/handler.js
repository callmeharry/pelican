/**
 * Created by lijie on 15/7/3.
 * 邮件处理人员接口
 */
var validator = require('validator');
var MailProxy = require('../proxy').Mail;
var MailModel = require('../models').Mail;
var MailSender = require('../common/mail');
var MailConfigProxy = require('../proxy').MailConfig;
var moment = require('moment');
var senderName = '鹈鹕邮件';


/**
 * 获取未处理邮件
 * @param req
 * @param res
 * @param next
 */
exports.getEmailList = function (req, res, next) {
    var id = validator.trim(req.user._id);
    var page = validator.trim(req.query.page);
    var query = {handler: id, isHandled: false};
    getEmailListByQuery(query, page, res);

};

exports.getSentEmailList = function (req, res, next) {
    var id = validator.trim(req.user._id);
    var page = validator.trim(req.query.page);
    MailConfigProxy.getConfig(function (err, data) {
        if (err) {
            next(err);
        }
        data = JSON.parse(data);
        var query = {handler: id, 'from.address': data.mailAddress};
        getEmailListByQuery(query, page, res);
    });
};

/**
 * 回复或发送邮件
 * @param req
 * @param res
 * @param next
 */
exports.replyOrSendEmail = function (req, res, next) {
    var subject = req.body.subject;
    var to = req.body.to.split(',');
    var text = req.body.text;
    var html = req.body.html;
    var mail = new MailModel();
    MailConfigProxy.getConfig(function (err, data) {
        if (err) {
            next(err);
        }
        data = JSON.parse(data);
        res.reply(0, 'success', data);
        return;
        mail.subject = subject;
        mail.text = text;
        mail.html = html;
        mail.from = {name: senderName, address: data.mailAddress};
        for (var i = 0; i < to.length; i++) {
            mail.to[i] = {name: 'noname', address: validator.trim(to[i])}
        }
        MailProxy.newAndSave(function (err, data) {
            if (err) {
                res.reply(101, '邮件未存储到数据库');
                return;
            }
            var mailOptions = {
                from: senderName + ' <' + data.mailAddress + '>',
                to: to,
                subject: subject,
                text: text,
                html: html
            };
            var mailSender = new MailSender(data);
            mailSender.sendMail(mailOptions, function (err, info) {
                if (err) {
                    res.reply(104, '无法连接到smtp服务器');
                } else {
                    req.reply(0, 'success');
                }

            });
        });
    });
};

/**
 * 处理邮件
 * @param req
 * @param res
 * @param next
 */
exports.manageEmail = function (req, res, next) {
    var mailId = req.body.mailId;
    MailProxy.handleMail(mailId, function (err) {
        if (err) {
            res.reply(101, '处理失败');
        } else {
            res.reply(0, 'success');
        }
    })
};

/**
 * 获取已处理邮件列表
 * @param req
 * @param res
 * @param next
 */
exports.getManagedEmailList = function (req, res, next) {
    var id = validator.trim(req.user._id);
    var page = validator.trim(req.query.page);
    var query = {handler: id, isHandled: true};
    getEmailListByQuery(query, page, res);
};

/**
 * 根据条件查询邮件列表
 * @param query
 *      查询条件
 * @param page
 *      当前页码
 * @param res
 */
function getEmailListByQuery(query, page, res) {
    MailProxy.findHandlerMailList(query, page, function (err, results, pageCount, itemCount) {
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
                receiveTime: results[i].receivedDate,
                fromNow: moment(results[i].receivedDate).locale('zh-cn').toNow()
            };
        }
        data.list = list;
        res.reply(0, 'success', data);
    });
}

exports.returnEmail = function (req, res, next) {
    var mailId = req.body.mailId;
    MailProxy.returnMail(mailId, function (err) {
        if (err) {
            res.reply(101, '处理失败');
        } else {
            res.reply(0, 'success');
        }
    })
}
