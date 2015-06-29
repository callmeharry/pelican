var express = require('express');
var router = express.Router();

var controller = require('../controllers');
var userController = controller.user;

var testApi = require('../test/api');


/* GET TEST page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});


/*---------user------------*/
router.get('/user', userController.helloUser);

router.post('/login', userController.login);



/*--------mail-------------*/




/*--------test-------------*/
router.post('/test', testApi.testApi);




module.exports = router;
