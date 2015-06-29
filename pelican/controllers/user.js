/**
 * Created by lewiskit on 15/6/28.
 */
var UserProxy = require('../proxy').User;

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