/**
 * Created by lewiskit on 15/7/7.
 * test unit for user
 */

var should = require('should');

var name = "lewisKit";

describe("Name", function () {
    it("The name should be lewisKit", function () {
        name.should.eql("lewisKit");
    });

});
