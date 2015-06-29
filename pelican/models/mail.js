/*---User Model Schema----*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MailSchema = new Schema({

    html: {type: String},
    text: {type: String},
    subject: {type: String},
    messageId: {type: String},
    priority: {type: String},
    from: [{
        address: {type: String},
        name: {type: String}
    }],

    to: [{
        address: {type: String},
        name: {type: String}
    }],

    date: {type: Date, default: Date.now},

    receivedDate: {type: Date, default: Date.now},


    attachments: [{
        contentType: {type: Date, default: Date.now},
        charset: {type: String},
        fileName: {type: String},
        contentDisposition: {type: String},
        transferEncoding: {type: String},
        generatedFileName: {type: String},
        contentId: {type: String},
        checksum: {type: String},
        length: {type: String},
        content: {type: Buffer}
    }]


});

MailSchema.index[{messageId: 1}, {unique: true}];

mongoose.model('Mail', MailSchema);

