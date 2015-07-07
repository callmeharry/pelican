/*---User Model Schema----*/
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var Schema = mongoose.Schema;

var DISTRIBUTE_STATUS = {
    NEW: 'new',
    DISTRIBUTED: 'distributed',
    RETURNED: 'returned',
    NONE: 'none',
};

var CHECKED_STATUS = {
    NONE: 'none',
    UNCHECKED: 'unchecked',
    CHECKED: 'checked',
    RETURNED: 'returned',
    SEND: 'send'
};


var MailSchema = new Schema({

    html: {type: String},
    text: {type: String},
    subject: {type: String},
    
    messageId: {type: String, unique: true},

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
    handleDeadline: {type: Date}, // 处理人员处理这封邮件的时限

    readers: [{  // 阅读这封邮件的所有人员
        type: String
    }],

    // 邮件分发状态，有3类：new:待分发；distributed: 已分发；returned: 已退回
    distributeStatus: {type: String, default: 'new'},

    isHandled: {type: Boolean, default: false}, // 邮件是否已经处理

    isChecked: {type: String, default: CHECKED_STATUS.NONE},    //邮件是否已经审核

    checkMan: {type: String},
    checkContent: {type: String}

});

MailSchema.plugin(mongoosePaginate);


//MailSchema.index({messageId: 1}, {unique: true});

mongoose.model('Mail', MailSchema);

exports.DISTRIBUTE_STATUS = DISTRIBUTE_STATUS;
exports.CHECKED_STATUS = CHECKED_STATUS;