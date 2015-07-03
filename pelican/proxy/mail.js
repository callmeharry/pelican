var moment = require('moment');
var MailModel = require('../models').Mail;

var MailSchema = require('../models/mail').MailSchema;


exports.newAndSave = function (mail, callback) {

    var mailModel = new MailModel();

    if (mail) {
        for (var index in mail) {
            mailModel['index'] = mail[index];
        }
        mailModel.save(callback);

    } else {
        return callback(null, null);
    }

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
    MailSchema.paginate(
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
}

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