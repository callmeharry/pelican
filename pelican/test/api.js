/**
 * Created by lewiskit on 15/6/29.
 */



var proxy = require('../proxy');
var UserProxy = proxy.User;
var validator = require('validator');

exports.testApi = function (req, res, next) {
    var username = validator.trim(req.body.username);
    var password = validator.trim(req.body.password);


    UserProxy.newAndSave(username, password, 3, function (err, user) {

        if (err) return next(err);

        res.reply(0, "success", user);


    });

};