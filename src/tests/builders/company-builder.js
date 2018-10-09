'use strict';

var Chance = require('chance'), chance = new Chance();
var Company = require('../../models/company');

var CompanyBuilder = function () {
  var displayName = chance.name();
  var workspaceName;
  return {
    withName: function (name) {
      displayName = name;
      return this;
    },
    withWorkspace: function (name) {
      workspaceName = name || chance.name();
      return this;
    },
    build: function (cb) {
      var company = new Company({ displayName: displayName });
      if (workspaceName) company.workspaces.push({ displayName: workspaceName });
      company.save(function (err, companySaved) {
        if (err) {
          cb(err);
        }
        cb(null, companySaved);
      });
    }
  };
};
module.exports = CompanyBuilder;