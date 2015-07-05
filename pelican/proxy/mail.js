var moment = require('moment');
var MailModel = require('../models').Mail;

exports.newAndSave = function (mail, callback) {

    if (mail) {
        var mailModel = new MailModel(mail);
        mailModel.save(callback);
    } else {
        return callback(null, null);
    }

};

exports.clear = function(callback){
    var mailModel = new MailModel();
    mailModel.clear(callback);
}

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
function getMailList(query, page, limit, callback) {
    var resultsPerPage = limit || 10;
    MailModel.paginate(
        query,
        {
            page: page,
            limit: resultsPerPage,
            columns: 'messageId subject receivedDate from isDistributed',
            sortBy: {
                receivedDate: -1
            }
        },
        callback
    );
};
/**
 * 获取邮件处理人员待处理邮件列表
 * @param id
 * @param page
 * @param callback
 */
exports.findHandlerNewMailList = function (id, page, callback) {
    return getMailList({handler: id, isHandled: false}, page, 10, callback);
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
        10,
        callback
    );
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

