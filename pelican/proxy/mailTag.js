/**
 * Created by VincentBel on 15/7/6.
 */

var models = require('../models');
var MailTagModel = models.MailTag;


/*
 * 新建一个邮件标签
 */
exports.newAndSave = function (tagName, callback) {
    var mailTagModel = new MailTagModel();

    mailTagModel.name = tagName;

    mailTagModel.save(callback);
};


/**
 * 根据邮件标签的id查找
 * @param id 邮件标签id
 * @param callback
 */
exports.findMailTagById = function (id, callback) {
    MailTagModel.findOne({'_id': id}, callback);
};

exports.findAllMailTags = function (callback) {
    MailTagModel.find(callback);
};

exports.deleteMailTagById = function (id, callback) {
    MailTagModel.findOneAndRemove({'_id': id}, callback)
};

exports.deleteMailTagByName = function (tagName, callback) {
    MailTagModel.findOneAndRemove({'name': tagName}, callback)
};

