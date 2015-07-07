/**
 * Created by VincentBel on 15/7/6.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MailTagSchema = new Schema({

    name: {type: String, unique: true},

    create_at: {type: Date, default: Date.now}

});

//index
MailTagSchema.index({name: 1}, {unique: true});


mongoose.model('MailTag', MailTagSchema);
