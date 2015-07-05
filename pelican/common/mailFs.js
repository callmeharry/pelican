/**
 * Created by lewiskit on 15/7/5.
 */


var fs = require('fs');

var path = require('path');

exports.writeMailConfig = function (mailConfig, callback) {

    fs.writeFile('./mailConfig.json', JSON.stringify(mailConfig), callback);

};


exports.readMailConfig = function (callback) {

    fs.readFile('./mailConfig.json', callback);

};