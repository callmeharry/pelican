/**
 * Created by lewiskit on 15/6/28.
 */
var UserProxy = require('../proxy').User;
var validator = require('validator');
var Log = require('../common').LogHelper;
var jwt = require('jsonwebtoken');

exports.login = function (req, res, next) {
    var username = validator.trim(req.body.username);
    var password = validator.trim(req.body.password);


    console.error(username + " " + password);

    UserProxy.findUserByName(username, function (err, user) {

        if (err) return next(err);

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


exports.getAllHandlers = function (req, tes, next) {
    if (req.user.role !== ROLE.DISTRIBUTION) {
        res.reply(101, "没有权限");
        return;
    }

    UserProxy.findUsersByRole(ROLE.HANDLER, function (err, users) {
        if (err) {
            return next(err);
        } else {

            var data = {};
            data.count = users.size;
            data.users = users;

            res.reply(0, "获取成功", data);
        }
    });
};