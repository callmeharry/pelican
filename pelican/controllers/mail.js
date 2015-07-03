/**
 * Created by lijie on 15/7/3.
 * 邮件controller 不分用户类型
 */
var MailModel = require('../proxy').Mail;

var ROLE = require('../models/user').ROLE;

/**
 * 获取单个邮件详情
 * @param req
 * @param res
 * @param next
 */
exports.getMailDetail = function(req, res, next) {
    var id = req.body.mailid;



    MailModel.getMailContent(id, function (err, mail) {
        if(err) {
            res.reply(101, '获取失败');
            return;
        }
        //判断是否有阅读权限
        if (req.user.role == ROLE.DISTRIBUTION ||
            req.user._id == mail.handler ||
            mail.reader.indexOf(req.user._id)) {
            res.reply(0,'success', mail);
        } else {
            res.reply(101, '没有权限')
        }

    });

};