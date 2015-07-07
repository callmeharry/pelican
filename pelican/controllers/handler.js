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
var ROLE = require('../models/user').ROLE;
var DISTRIBUTED_STATUS = require('../models/mail').DISTRIBUTE_STATUS;
var CHECK_STATUS = require('../models/mail').CHECKED_STATUS;

/**
 * 获取未处理邮件
 * @param req
 * @param res
 * @param next
 */
exports.getUnseenEmailList = function (req, res, next) {
    var id = validator.trim(req.user._id);
    var page = validator.trim(req.query.page);
    var query = {handler: id, isHandled: false, distributedStatus: DISTRIBUTED_STATUS.DISTRIBUTED};
    if (req.user.role !== ROLE.HANDLER) {
        res.reply(101, "没有权限");
        return;
    }
    getEmailListByQuery(query, page, res);

};

exports.getSentEmailList = function (req, res, next) {
    var id = validator.trim(req.user._id);
    var page = validator.trim(req.query.page);
    if (req.user.role !== ROLE.HANDLER) {
        res.reply(101, "没有权限");
        return;
    }
    MailConfigProxy.getConfig(function (err, data) {
        if (err) {
            next(err);
        }
        data = JSON.parse(data);
        var query = {handler: id, 'from.address': data.mailAddress, isChecked: CHECK_STATUS.CHECKED};
        getEmailListByQuery(query, page, res);
    });
};

/**
 * 邮件处理人员回复或发送邮件
 * @param req
 * @param res
 * @param next
 */
exports.sendEmail = function (req, res, next) {
    var subject = req.body.subject;
    var to = req.body.to.split(',');
    var text = req.body.text;
    var html = req.body.html;
    var mail = new MailModel();
    var checker = req.body.checker;
    if (req.user.role !== ROLE.HANDLER) {
        res.reply(101, "没有权限");
        return;
    }
    MailConfigProxy.getConfig(function (err, data) {
        if (err) {
            res.reply(101, '获取企业邮箱信息失败');
            return;
        }
        data = JSON.parse(data);
        mail.handler = validator.trim(req.user._id);
        mail.subject = subject;
        mail.text = text;
        mail.html = html;
        mail.from = {name: senderName, address: data.mailAddress};
        mail.checkMan = checker;
        mail.distributedStatus = DISTRIBUTED_STATUS.NONE;
        mail.messageId = Date.now().toLocaleString() + '@pelican';
        mail.isHandled = true;
        if (checker != '0')
            mail.isChecked = CHECK_STATUS.UNCHECKED;
        else
            mail.isChecked = CHECK_STATUS.CHECKED;
        for (var i = 0; i < to.length; i++) {
            mail.to[i] = {name: 'noname', address: validator.trim(to[i])}
        }
        MailProxy.newAndSave(mail, function (err, data2) {
            if (err) {
                res.reply(101, '邮件未存储到数据库');
                return;
            }
            if (mail.isChecked === CHECK_STATUS.UNCHECKED) {
                res.reply(0, '邮件回复成功，等待审核人员审核');
                return;
            }
            var mailOptions = {
                from: data.mailAddress, // sender address
                to: to, // list of receivers
                subject: subject, // Subject line
                text: text, // plaintext body
                html: html // html body
            };
            var mailSender = new MailSender(data);
            mailSender.sendMail(mailOptions, function (err, info) {
                if (err) {
                    res.reply(104, err);
                } else {
                    res.reply(0, '邮件已发送');
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
    if (req.user.role !== ROLE.HANDLER) {
        res.reply(101, "没有权限");
        return;
    }
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
    if (req.user.role !== ROLE.HANDLER) {
        res.reply(101, "没有权限");
        return;
    }
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
                receiveTime: results[i].date,
                fromNow: moment(results[i].date).locale('zh-cn').toNow()
            };
        }
        data.list = list;
        res.reply(0, 'success', data);
    });
}

/**
 * 邮件处理人员退回邮件
 * @param id
 * @param callback
 */
exports.returnEmail = function (req, res, next) {
    var mailId = req.body.mailId;
    if (req.user.role !== ROLE.HANDLER) {
        res.reply(101, "没有权限");
        return;
    }
    MailProxy.returnMail(mailId, function (err) {
        if (err) {
            res.reply(101, '处理失败');
        } else {
            res.reply(0, 'success');
        }
    })
};

/**
 * 邮件处理人员获取已退回的邮件列表
 * @param req
 * @param res
 * @param next
 */
exports.getReturnedEmailList = function (req, res, next) {
    var id = validator.trim(req.user._id);
    var page = validator.trim(req.query.page);
    var query = {handler: id, isChecked: CHECK_STATUS.RETURNED};
    if (req.user.role !== ROLE.HANDLER) {
        res.reply(101, "没有权限");
        return;
    }
    getEmailListByQuery(query, page, res);
};

/**
 * 邮件处理人员获取审核中的邮件列表
 * @param req
 * @param res
 * @param next
 */
exports.getCheckingEmailList = function (req, res, next) {
    var id = validator.trim(req.user._id);
    var page = validator.trim(req.query.page);
    var query = {handler: id, isChecked: CHECK_STATUS.UNCHECKED};
    if (req.user.role !== ROLE.HANDLER) {
        res.reply(101, "没有权限");
        return;
    }
    getEmailListByQuery(query, page, res);
};