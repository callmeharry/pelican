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

/**
 * 根据用户的id查找
 * @param id    用户的id
 * @param callback
 */
exports.findUserById = function (id, callback) {
    UserModel.findOne({'_id': id}, callback);
};

/**
 * 查找满足条件的一群用户
 * @param ids
 * @param callback
 */
exports.findUsersByIds = function (ids, callback) {

    if (ids.length == 0)
        return callback(null, []);

    UserModel.find({'_id': {"$in": ids}}, callback);
};

/**
 * 根据用户名字查找某些用户
 * @param names
 * @param callback
 * @returns {*}
 */
exports.findUsersByNames = function (names, callback) {
    if (names.length == 0)
        return callback(null, []);

    UserModel.find({_id: {"$in": names}}, callback);

};


/**
 * 根据用户角色查找用户
 * @param role 用户角色
 * @param callback
 */
exports.findUsersByRole = function (role, callback) {

    UserModel.find()
        .where('role').equals(role)
        .exec(callback);
};


/**
 * 根据关键字，获取一组用户
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {*} query 关键字
 * @param {Object} opt 选项
 * @param {Function} callback 回调函数
 */
exports.getUsersByQuery = function (query, opt, callback) {
    UserModel.find(query, '', opt, callback);
};

exports.deleteUserById = function (id, callback) {
    UserModel.findOneAndRemove({'_id': id}, callback);
};

