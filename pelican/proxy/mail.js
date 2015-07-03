var moment = require('moment');
var MailModel = require('../models').Mail;


exports.newAndSave = function (mail, callback) {

    var mailModel = new MailModel();

    if (mail) {
        for (var index in mail) {
            mailModel['index'] = mail[index];
        }
        mailModel.save(callback);

    } else {
        return callback(null, null);
    }

};



