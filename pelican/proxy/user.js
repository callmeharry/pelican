/**
 * CRUD for UserModel
 */

var models = require('../models');
var UserModel = models.User;

exports.newAndSave = function (username, password, role, callback) {
    var userModel = new UserModel();

    userModel.username = username;
    userModel.password = password;
    userModel.role = role;

    userModel.save(callback);
    
};
