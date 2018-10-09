'use strict';
var request = require('supertest');
require('should');

var baseurl = 'http://localhost:3090'
describe('Company Test',function(){
    describe('Given I am want to create a company in the system', function(){
        it('Then I should get the company sucessfully created', function(done){
            var displayName = "CompanyName";
            request(baseurl).post('/companies')
            .send({displayName:displayName})
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.body.displayName.should.equal(displayName);
                res.body.name.should.equal(displayName.toLowerCase());
                done();
            });
        });
    });
    describe('Given I try to create a company already exists in the system', function(){
        it('Then I should get an error', function(done){
            var displayName = "CompanyName";
            request(baseurl).post('/companies')
            .send({displayName:displayName})
            .end(function (err, res) {
                res.status.should.equal(400);
                done();
            });
        });
    });
});