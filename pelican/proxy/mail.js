var moment = require('moment');
var MailModel = require('../models').Mail;
var DISTRIBUTE_STATUS = require('../models/mail').DISTRIBUTE_STATUS;
var MailConfig = require("../proxy").MailConfig;
var async = require('async');

exports.newAndSave = function (mail, callback) {

    if (mail) {
        MailModel.findOne({'messageId': mail.messageId}, function (err, data) {
            if (err || data != undefined) {

            }
            else {
                var mailModel = new MailModel(mail);
                mailModel.save(callback);
            }
        });
    }
    else {
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
 * @param columns
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
                date: -1
            }
        },
        callback
    );
}
/**
 * 获取邮件处理人员待处理邮件列表
 * @param query
 * @param page
 * @param callback
 */
exports.findHandlerMailList = function (query, page, callback) {
    return getMailList(query, page, 15, 'messageId subject date from isHandled', callback);
};

/**
 * 获取邮件分发人员的邮件列表，分页显示
 * @param type
 * @param page 第几页
 * @param callback
 * @returns {*}
 */
exports.getDistributorMailListByType = function (type, page, callback) {
    return getMailList(
        {distributeStatus: type},
        page,
        15,
        'messageId subject date from distributeStatus',
        callback
    );
};

exports.getDistributorOutDatedMailList = function (page, callback) {
    return getMailList(
        {
            handleDeadline: {$gt: Date.now()}
        },
        page,
        15,
        'messageId subject date from',
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
    return getMailList(query, page, 15, 'messageId subject date from to isChecked', callback);
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
        mail.distributeStatus = DISTRIBUTE_STATUS.RETURNED;
        mail.save(callback);
    })
};

var mailQueue = async.queue(function (task, callback) {
    console.log('worker is processing task ', task.name);
    task.run(callback);
}, 1);


mailQueue.saturated = function () {
    console.log('all workers to be used');
};

/**
 * 监听：当最后一个任务交给worker时，将调用该函数
 */
mailQueue.empty = function () {
    console.log('no more tasks wating');
};

exports.mailQueue = mailQueue;


