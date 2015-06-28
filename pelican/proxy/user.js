/**
 * CRUD for UserModel
 */

var models = require('../models');
var UserModel = models.User;

exports.newAndSave = function (username, password, type, callback) {
    var userModel = new UserModel();

    userModel.username = username;
    userModel.password = password;
    userModel.type = type;

    userModel.save(callback);


};
