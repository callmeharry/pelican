var express = require('express');
var router = express.Router();

var controller = require('../controllers');
var userController = controller.user;
var handlerController = controller.handler;
var mailController = controller.mail;
var mailConfigController = controller.mailConfig;
var distributorController = controller.distributor;
var mailTagController = controller.mailTag;
var checkController = controller.check;


var testApi = require('../test/api');

var jwt = require('jsonwebtoken');

/* GET TEST page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});


/*--------test-------------*/

router.get('/test/addMail', testApi.testMail);


router.post('/login', userController.login);

// route middleware to verify a token
router.use(function (req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, req.app.get('superSecret'), function (err, decoded) {
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

router.post('/test', testApi.testApi);

/*---------user------------*/


router.get('/distribution/handlers', userController.getAllHandlers);

/*--------mail-------------*/
router.get('/email/detail', mailController.getMailDetail);


router.get("/admin/mailConfig", mailConfigController.getMailConfig);

router.post("/admin/mailConfig", mailConfigController.setMailConfig);


/*邮件分发人员*/

router.get('/distribution/getMailList', distributorController.getMailList);
router.get('/distribution/getMailInfo', mailController.getMailDetail);
router.post('/distribution/distributeMail', distributorController.distribute);

router.get('/mailTag', mailTagController.getAllMailTags);
router.post('/mailTag/add', mailTagController.addMailTag);
router.post('/mailTag/delete', mailTagController.deleteMailTag);


/* 邮件处理人员 */
router.get('/email/list', handlerController.getEmailList);
router.post('/email/reply', handlerController.replyOrSendEmail);
router.post('/email/manage', handlerController.manageEmail);
router.post('/email/send', handlerController.replyOrSendEmail);
router.get('/email/managed', handlerController.getManagedEmailList);
router.post('/email/return', handlerController.returnEmail);


/*邮件审核人员*/
router.get('/check/unCheckList', checkController.getUnCheckList);
router.get('/check/checkedList', checkController.getCheckedList);
router.get('/check/getMailInfo', mailController.getMailDetail);
router.post('/check/setCheckStatus', checkController.setCheckStatus);


module.exports = router;
