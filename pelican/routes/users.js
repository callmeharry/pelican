var express = require('express');
var router = express.Router();
var UserProxy = require('../proxy').User;


/* GET users listing. */
router.get('/', function (req, res, next) {

    //UserProxy.newAndSave('lewiskit2', '123', 1, function (err) {
    //    if (err) {
    //        console.log("hehheda");
    //        return next(err);
    //    }
    //
    //    res.send('success');
    //});
    res.send({status: 0, message: "hello world!"});
});

module.exports = router;
