var express = require('express');
var router = express.Router();
var UserProxy = require('../proxy').User;


/* GET users listing. */
router.get('/', function (req, res, next) {

    UserProxy.newAndSave('lewiskit', '123', 1, function (err) {
        if (err) return next(err);

        res.send('success');
    });

});

module.exports = router;
