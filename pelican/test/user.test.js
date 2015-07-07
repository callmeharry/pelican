/**
 * Created by lewiskit on 15/7/7.
 * test unit for user
 */
var app = require('../app');
var should = require('should');
var request = require('supertest')(app);
var jwt = require('jsonwebtoken');
var name = "lewisKit";
var config = require('../config');
var mongoose = require('mongoose');


describe("Name", function () {
    it("The name should be lewisKit", function () {
        name.should.eql("lewisKit");
    });

});


describe("user", function () {
    var token;


    //链接mongodb
    before(function (done) {

        //mongoose.connect(config.db, config.dbOpts, function (err) {
        //    if (err) {
        //        console.error('connect to %s error: ', config.db, err.message);
        //        process.exit(1);
        //    }
        //
        //
        //    console.log('connect to mongodb successfully');
        //    done();
        //
        //});

        token = jwt.sign({username: 'checker', password: '123456'}, app.get('superSecret'), {
            expiresInMinutes: 1440 // expires in 24 hours
        });
        done();

    });


    it("The post should get all Users", function (done) {
        request.post('/test')
            .send({
                token: token
            })
            .end(function (err, res) {
                //should.not.exists(err);
                //console.log(res);
                res.body.should.eql({
                    apiVersion: '0.1',
                    status: 0,
                    message: 'success',
                    data: {change: '2015年7月7日'}
                });
                this.timeout(10000);
                setTimeout(done, 10000);
                //done();
            });
    });


});
