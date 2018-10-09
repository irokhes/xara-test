'use strict';

var config = require('../utils/config');
var request = require('supertest');
var CompanyBuilder = require('./builders/company-builder');
var constants = require('../utils/constants');

var baseurl = config.settings.baseUrl;

describe('Users Test', function () {
  describe('Given an existing company with a workspace', function () {
    var company;
    before(function (done) {
      new CompanyBuilder().withWorkspace().build(function (err, comp) {
        company = comp;
        done();
      });
    })
    describe('When I try associate a user to a workspace', function () {
      it('Then I should be able to add a user', function (done) {
        var email = 'user@xara.com';
        var role = constants.role.basic;
        request(baseurl).post('/companies/' + company._id + '/workspaces/' + company.workspaces[0]._id + '/users')
          .send({ email: email, role: role })
          .end(function (err, res) {
            res.status.should.equal(201);
            res.body[0].email.should.equal(email);
            res.body[0].role.should.equal(constants.role.basic);
            done();
          });
      });
    });
  });
  describe('Given I try to asociate a user with an invalid email', function () {
    var company;

    before(function (done) {
      new CompanyBuilder().withWorkspace().build(function (err, comp) {
        company = comp;
        done();
      });
    });
    it('Then I should get an error', function (done) {
      var email = 'invalid';
      var role = constants.role.basic;
      request(baseurl).post('/companies/' + company._id + '/workspaces/' + company.workspaces[0]._id + '/users')
        .send({ email: email, role: role })
        .end(function (err, res) {
          res.status.should.equal(400);
          done();
        });
    });
  });
  describe('Given I try to asociate a user with an invalid role', function () {
    var company;

    before(function (done) {
      new CompanyBuilder().withWorkspace().build(function (err, comp) {
        company = comp;
        done();
      });
    });
    it('Then I should get an error', function (done) {
      var email = 'user@xara.com';
      var role = 'invalid';
      request(baseurl).post('/companies/' + company._id + '/workspaces/' + company.workspaces[0]._id + '/users')
        .send({ email: email, role: role })
        .end(function (err, res) {
          res.status.should.equal(400);
          done();
        });
    });
  });
  describe('Given an existing user associated to the workspace', function () {
    var company;
    before(function (done) {
      new CompanyBuilder().withWorkspace().withUser().build(function (err, comp) {
        company = comp;
        done();
      });
    });
    describe('When I try to update the information', function () {
      it('Then I should be able to do it', function (done) {
        var newName = "newWorkspaceName";
        request(baseurl).put('/companies/' + company._id + '/workspaces/' + company.workspaces[0]._id + '/users/' + company.workspaces[0].users[0].email)
          .send({ displayName: newName })
          .end(function (err, res) {
            res.status.should.equal(204);
            done();
          });
      });
    });
  })
});