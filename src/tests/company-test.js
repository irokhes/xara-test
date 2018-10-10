'use strict';
var config = require('../utils/config');
var request = require('supertest');
var CompanyBuilder = require('./builders/company-builder');

var baseurl = config.settings.baseUrl;

describe('Company Test', function () {
  describe('Given I am want to create a company in the system', function () {
    it('Then I should get the company sucessfully created', function (done) {
      var displayName = "CompanyName";
      request(baseurl).post('/companies')
        .send({ displayName: displayName })
        .end(function (err, res) {
          if (err) {
            throw err;
          }
          res.status.should.equal(201);
          res.body.displayName.should.equal(displayName);
          res.body.name.should.equal(displayName.toLowerCase());
          done();
        });
    });
  });
  describe('Given I try to create a company already exists in the system', function () {
    var company;
    before(function (done) {
      new CompanyBuilder().build(function (err, comp) {
        company = comp;
        done();
      });
    });
    it('Then I should get an error', function (done) {
      request(baseurl).post('/companies')
        .send({ displayName: company.displayName })
        .end(function (err, res) {
          res.status.should.equal(400);
          done();
        });
    });
  });
  describe('Given an existing company', function () {
    var company;
    before(function (done) {
      new CompanyBuilder().build(function (err, comp) {
        company = comp;
        done();
      });
    });
    describe('When I try to update the information', function () {
      it('Then I should be able to do it', function (done) {
        var newName = "newName";
        request(baseurl).patch('/companies/' + company._id)
          .send({ displayName: newName })
          .end(function (err, res) {
            res.status.should.equal(204);
            done();
          });
      })
    })
  })
});