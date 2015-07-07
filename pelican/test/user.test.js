/**
 * Created by lewiskit on 15/7/7.
 * test unit for user
 */
var app = require('../app');
var should = require('should');
var request = require('supertest')(app);
var jwt = require('jsonwebtoken');
var name = "lewisKit";

describe("Name", function () {
    it("The name should be lewisKit", function () {
        name.should.eql("lewisKit");
    });

});


describe("user", function () {

    it("The post should get all Users", function (done) {
        request.post('/admin/users')
            .send({
                token: jwt.sign({username: 'checker', password: '123456'}, app.get('superSecret'), {
                    expiresInMinutes: 1440 // expires in 24 hours
                })
            })
            .end(function (err, res) {
                should.not.exists(err);

                done();
            });
    });


});
