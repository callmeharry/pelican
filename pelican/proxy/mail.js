var moment = require('moment');
var MailModel = require('../models').Mail;
var MailConfig = require("../proxy").MailConfig;

exports.newAndSave = function (mail, callback) {

    if (mail) {
        var mailModel = new MailModel(mail);
        mailModel.save(callback);
    } else {
        return callback(null, null);
    }

};

exports.clear = function(){
    MailModel.remove({},function(err){
        console.log(err);
    });
};

exports.findMailById = function (id, callback) {
    MailModel.findOne({'_id':id}, callback);
};


/**
 * 根据 query 获取分页的邮件列表
 * @param query
 * @param page 第几页
 * @param limit 每页数量
 * @param callback
 */
function getMailList(query, page, limit, columns, callback) {
    var resultsPerPage = limit || 200;
    MailModel.paginate(
        query,
        {
            page: page,
            limit: resultsPerPage,
            columns: columns,
            sortBy: {
                receivedDate: -1
            }
        },
        callback
    );
}
/**
 * 获取邮件处理人员待处理邮件列表
 * @param id
 * @param page
 * @param callback
 */
exports.findHandlerMailList = function (query, page, callback) {
    return getMailList(query, page, 15, 'messageId subject receivedDate from isHandled', callback);
};

/**
 * 获取所有的邮件列表，分页显示
 * @param page 第几页
 * @param callback
 * @returns {*}
 */
exports.getAllMailList = function (page, callback) {
    return getMailList(
        {},
        page,
        30,
        'messageId subject receivedDate from isDistributed',
        callback
    );
};

/**
 * 获取审核邮件列表
 * @param query  查询条件
 * @param page   第几页
 * @param callback
 * @returns {*}
 */

exports.getCheckMailList = function (query, page, callback) {
    return getMailList(query, page, 30, 'messageId subject receivedDate from isChecked', callback);
};



/**
 * 通过id将邮件已处理信息置为true
 * @param id
 * @param callback
 */
exports.handleMail = function (id, callback) {
    this.findMailById(id, function (err, mail) {
        if(err)
            return callback(err,null);
        mail.isHandled = true;
        mail.save(callback);
    })
};


exports.updateMailById = function (id, ups, callback) {
    MailModel.update({_id: id}, {"$set": ups}, callback);
};

exports.returnMail = function (id, callback) {
    this.findMailById(id, function (err, mail) {
        if (err)
            return callback(err, null);
        mail.isHandled = false;
        mail.save(callback);
    })
};



