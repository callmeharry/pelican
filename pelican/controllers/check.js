/**
 * Created by lewiskit on 15/7/7.
 * 邮件审核
 */

var proxy = require('../proxy');
var MailProxy = proxy.Mail;


exports.getCheckList = function (req, res, next) {
    var user = req.body.user;
    var page = req.body.page;

    var query = {checkMan: user._id, isHandled: true};

    MailProxy.getCheckMailList(query, page, function (err, results, pageCount, itemCount) {
        if (err) return next(err);

    });




};



