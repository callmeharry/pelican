var express = require('express');
var router = express.Router();

var controller = require('../controllers');
var userController = controller.user;
var mailConfigController = controller.mailConfig;

var testApi = require('../test/api');

/* GET TEST page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.post('/login', userController.login);

router.post('/test', testApi.testApi);


// route middleware to verify a token
router.use(function (req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function (err, decoded) {
            if (err) {
                return res.reply(1, 'Failed to authenticate token.');
            } else {
                // if everything is good, save to request for use in other routes
                req.user = decoded;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.reply(403, 'No token provided.');
    }
});

/*---------以下的接口都需要提供token-----------*/


/*---------user------------*/
router.get('/user', userController.helloUser);

router.post('/login', userController.login);



/*--------mail-------------*/
router.get("/admin/mailConfig",mailConfigController.mailConfig);



/*--------test-------------*/
router.post('/test', testApi.testApi);




module.exports = router;
