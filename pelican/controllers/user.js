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