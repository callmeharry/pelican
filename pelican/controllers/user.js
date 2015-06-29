/**
 * Created by lewiskit on 15/6/28.
 */
var UserProxy = require('../proxy').User;
var validator = require('validator');
var Log = require('../common').LogHelper;

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

    console.log(username + " " + password);

    UserProxy.findUserByName(username, function (err, user) {

        if (err) return next(err);

        if (!user) {
            res.reply(101, "no such user");
            return;
        }

        res.reply(0, "success", user);

    });


};