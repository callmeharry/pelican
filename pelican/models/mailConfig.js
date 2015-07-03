/**
 * Created by GYX on 15/7/3.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var configScheam = new Schema({

    smtp: {type: String},
    smtpPort: {type: String},
    imap: {type: String},
    imapPort: {type: String},
    mailAddress: {type: String},
    password: {type:String}
});

//settingScheam.index[{messageId: 1}, {unique: true}];

mongoose.model('MailConfig', configScheam);

