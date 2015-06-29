/**
 * CRUD for UserModel
 */

var models = require('../models');
var UserModel = models.User;


/*
 新建一个用户
 */
exports.newAndSave = function (username, password, role, callback) {
    var userModel = new UserModel();

    userModel.username = username;
    userModel.password = password;
    userModel.role = role;

    userModel.save(callback);

};


/**
 * 根据用户名字查找
 * @param username 用户名字
 * @param callback 回调函数
 */
exports.findUserByName = function (username, callback) {

    UserModel.findOne({'username': username}, callback);

};