/**
 * Created by lewiskit on 15/7/7.
 * 邮件审核
 */

var proxy = require('../proxy');
var MailProxy = proxy.Mail;
var moment = require('moment');


exports.getCheckList = function (req, res, next) {
    var user = req.body.user;
    var page = req.body.page;

    var query = {checkMan: user._id, isHandled: true};

    MailProxy.getCheckMailList(query, page, function (err, results, pageCount, itemCount) {
        if (err) return next(err);

        if (!results) {
            res.reply(101, '没有邮件');
            return;
        }

        var data = {};
        data['pageCount'] = pageCount;

        var list = [];

        for (var item in results) {
            list.push({
                mailId: item._id,
                title: item.subject,
                senderName: item.from,
                receiveTime: item.receivedDate,
                fromNow: moment(results[i].receivedDate).locale('zh-cn').toNow()
            });
        }
        data.list = list;

        res.reply(0, 'success', data);

    });

};







