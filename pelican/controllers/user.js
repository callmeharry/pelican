/**
 * Created by lewiskit on 15/6/28.
 */
var UserProxy = require('../proxy').User;
var validator = require('validator');
var Log = require('../common').LogHelper;
var jwt = require('jsonwebtoken');

exports.helloUser = function (req, res, next) {
    //UserProxy.newAndSave('lewiskit2', '123', 1, function (err) {
    //    if (err) {
    //        console.log("hehheda");
    //        return next(err);
    //    }
    //
    //    res.send('success');
    //});
    //res.send({status: 0, message: "hello world!"});
    res.reply(0, "success", {user: "hello world"});

};

exports.login = function (req, res, next) {
    var username = validator.trim(req.body.username);
    var password = validator.trim(req.body.password);

    console.error(username + " " + password);

    UserProxy.findUserByName(username, function (err, user) {

        if (err) return next(err);

        if (!user || user.password != password) {
            res.reply(101, "no such user");
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