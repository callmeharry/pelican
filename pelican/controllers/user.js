/**
 * Created by lewiskit on 15/6/28.
 */
var UserProxy = require('../proxy').User;
var validator = require('validator');
var Log = require('../common').LogHelper;
var jwt = require('jsonwebtoken');

var ROLE = require('../models/user').ROLE;

exports.login = function (req, res, next) {
    var username = validator.trim(req.body.username);
    var password = validator.trim(req.body.password);


    console.error(username + " " + password);

    UserProxy.findUserByName(username, function (err, user) {

        if (err) return next(err);

        //console.log(user);

        if (!user) {
            res.reply(101, "用户名或密码错误");
            return;
        }

        console.log(user.toString());

        if (user.password != password) {
            res.reply(101, "用户名或密码错误");
            return;
        }

        // create a token
        var token = jwt.sign(user, req.app.get('superSecret'), {
            expiresInMinutes: 1440 // expires in 24 hours
        });

        var data = {};
        data.username = user.username;
        data.role = user.role;
        data.token = token;

        res.reply(0, "success", data);

    });
};

exports.addUser = function (req, res, next) {
    if (req.user.role !== ROLE.ADMIN) {
        res.reply(101, "没有权限");
        return;
    }

    var username = validator.trim(req.body.username);
    var password = validator.trim(req.body.password);
    var role = validator.trim(req.body.role);


    // 判断发送的 role 参数是否合法

    var isRoleValid = false;
    for (var property in ROLE) {
        if (ROLE.hasOwnProperty(property) && role == ROLE[property]) {
            isRoleValid = true;
            break;
        }
    }

    if (!isRoleValid) {
        res.reply(103, "不存在的用户角色");
        return;
    }

    UserProxy.findUserByName(username, function (err, user) {
        if (err) {
            return next(err);
        }

        if (user) {
            res.reply(102, "用户名已存在");
            return;
        }

        UserProxy.newAndSave(username, password, role, function (err, user) {
            if (err) {
                return next(err);
            }

            var data = {};
            data.id = user._id;
            data.username = user.username;
            data.role = user.role;
            res.reply(0, "添加成功", data);
        });
    });
};


exports.deleteUser = function (req, res, next) {
    if (req.user.role !== ROLE.ADMIN) {
        res.reply(101, "没有权限");
        return;
    }

    var id = validator.trim(req.body.id);
    if (!id) {
        res.reply(102, "invaid input");
    }

    UserProxy.deleteUserById(id, function (err, user) {
        if (err) {
            next(err);
        } else {
            if (user) {
                res.reply(0, "删除成功");
            } else {
                res.reply(101, "用户不存在");
            }
        }
    });
};

exports.getAllHandlers = function (req, res, next) {
    if (req.user.role !== ROLE.DISTRIBUTOR) {
        res.reply(101, "没有权限");
        return;
    }

    UserProxy.findUsersByRole(ROLE.HANDLER, function (err, users) {
        if (err) {
            return next(err);
        } else {

            var data = {};
            data.count = users.length;
            data.users = [users.length];

            for (var i = 0; i < users.length; ++i) {
                var resUser = {
                    id: users[i]._id,
                    username: users[i].username
                };
                data.users[i] = resUser;
            }

            res.reply(0, "获取成功", data);
        }
    });
};


/**
 * 邮件处理人员获取审核人员列表
 * @param req
 * @param res
 * @param next
 */
exports.getAllChecker = function (req, res, next) {
    if (req.user.role !== ROLE.HANDLER) {
        res.reply(101, "没有权限");
        return;
    }
    UserProxy.findUsersByRole(ROLE.CHECKER, function (err, users) {
        if (err) {
            return next(err);
        } else {

            var data = {};
            data.count = users.length;
            data.users = [users.length];

            for (var i = 0; i < users.length; ++i) {
                var resUser = {
                    id: users[i]._id,
                    username: users[i].username
                };
                data.users[i] = resUser;
            }

            res.reply(0, "获取成功", data);
        }
    });
};


exports.getAllUsers = function (req, res, next) {

    UserProxy.getUsersByQuery({role: {$nin: ['admin']}}, {}, function (err, users) {
        if (err) return next(err);

        res.reply(0, 'success', users);
    });
    
};