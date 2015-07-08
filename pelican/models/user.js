/**
 * Created by lewiskit on 15/6/28.
 *
 * User Model Schema
 */
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;

var ROLE = {
    ADMIN: 'admin',
    HANDLER: 'handler',
    DISTRIBUTOR: 'distributor',
    CHECKER: 'checker'
};

exports.ROLE = ROLE;

var UserSchema = new Schema({

    username: {type: String, unique: true},
    password: {type: String},

    role: {type: String, default: ROLE.HANDLER},

    create_at: {type: Date, default: Date.now}

});

//index
UserSchema.index({username: 1}, {unique: true});

UserSchema.plugin(mongoosePaginate);


mongoose.model('User', UserSchema);







