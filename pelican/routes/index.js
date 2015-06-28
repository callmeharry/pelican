var express = require('express');
var router = express.Router();

var controller = require('../controllers');
var userContro = controller.user;


/* GET TEST page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});


/*---------user------------*/
router.get('/user', userContro.helloUser);


/*--------mail-------------*/


module.exports = router;
