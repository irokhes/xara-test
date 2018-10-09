'use strict';

var config = require('../utils/config');
var request = require('supertest');
var CompanyBuilder = require('./builders/company-builder');

var baseurl = config.settings.baseUrl;

describe('Workspace Test', function () {
  describe('Given an existing company', function () {
    var company;
    before(function (done) {
      new CompanyBuilder().build(function (err, comp) {
        company = comp;
        done();
      });
    })
    it('Then I should be able to add a workspace', function (done) {
      var workspaceName = 'Workspace name';
      request(baseurl).post('/companies/' + company._id + '/workspaces')
        .send({ displayName: workspaceName })
        .end(function (err, res) {
          res.status.should.equal(201);
          res.body[0].displayName.should.equal(workspaceName);
          res.body[0].name.should.equal(workspaceName.toLowerCase());
          done();
        });
    });
  });
  describe('Given I try to create a workspace already exists in the company', function () {
    var company;
    before(function (done) {
      new CompanyBuilder().withWorkspace().build(function (err, comp) {
        company = comp;
        done();
      });
    });
    it('Then I should get an error', function (done) {
      request(baseurl).post('/companies/' + company._id + '/workspaces')
        .send({ displayName: company.workspaces[0].displayName })
        .end(function (err, res) {
          res.status.should.equal(400);
          done();
        });
    });
  });
  describe('Given an existing workspace', function () {
    var company;
    before(function (done) {
      new CompanyBuilder().withWorkspace().build(function (err, comp) {
        company = comp;
        done();
      });
    });
    describe('When I try to update the information', function () {
      it('Then I should be able to do it', function (done) {
        var newName = "newWorkspaceName";
        request(baseurl).put('/companies/' + company._id + '/workspaces/' + company.workspaces[0]._id)
          .send({ displayName: newName })
          .end(function (err, res) {
            res.status.should.equal(204);
            done();
          });
      })
    })
  })
});