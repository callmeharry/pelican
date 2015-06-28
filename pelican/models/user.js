/**
 * Created by lewiskit on 15/6/28.
 *
 * User Model Schema
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({

    username: {type: String},
    password: {type: String},
    /**
     * 0 - admin
     * 1 - 邮件分发人员
     * 2 - 邮件处理人员
     * 3 - 邮件审核人员
     */
    type: {type: Number, default: 1},

    create_at: {type: Date, default: Date.now}


});

//index
UserSchema.index({username: 1}, {unique: true});


mongoose.model('User', UserSchema);







