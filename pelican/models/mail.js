/*---User Model Schema----*/
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

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
        contentType: {type: String},
        charset: {type: String},
        fileName: {type: String},
        contentDisposition: {type: String},
        transferEncoding: {type: String},
        generatedFileName: {type: String},
        contentId: {type: String},
        checksum: {type: String},
        length: {type: String},
        content: {type: Buffer}
    }],

    handler: {type: String},  // 处理这封邮件的人员
    readers: [{  // 阅读这封邮件的所有人员
        type: String
    }],

    isDistributed: {type: Boolean, default: false}, // 邮件是否已经分发
    isHandled: {type: Boolean, default: false}, // 邮件是否已经处理

    isChecked: {type: Boolean, default: false},    //邮件是否已经审核

    checkMan: {type: String},
    checkContent: {type: String}

});

MailSchema.plugin(mongoosePaginate);


//MailSchema.index({messageId: 1}, {unique: true});

mongoose.model('Mail', MailSchema);

