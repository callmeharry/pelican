/**
 * Created by lewiskit on 15/6/29.
 */

exports.testApi = function (req, res, next) {

    res.reply(0, "success", {data: "hello world!"});

};