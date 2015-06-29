/**
 * CRUD for UserModel
 */

var models = require('../models');
var UserModel = models.User;

var ROLE = {
    ADMIN: 'admin',
    HANDLER: 'handler',
    DISTRIBUTION: 'distribution',
    CHECKER: 'check'
};

exports.ROLE = ROLE;

exports.newAndSave = function (username, password, type, callback) {
    var userModel = new UserModel();

    userModel.username = username;
    userModel.password = password;
    userModel.role = role;

    userModel.save(callback);


};

exports.check = function (username, password) {
    // TODO 检查用户名密码是否正确

    var userModel = new UserModel();
    userModel.username = "vincent";
    userModel.type = ROLE.ADMIN;
    userModel.token = "alksdjfsa";

    return userModel;
    // 如果正确，返回用户model

    // 如果错误，返回错误信息
};
