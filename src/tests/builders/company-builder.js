'use strict';
var constants = require('../../utils/constants');
var Chance = require('chance'), chance = new Chance();
var Company = require('../../models/company');

var CompanyBuilder = function () {
  var displayName = chance.name();
  var workspaceName, userEmail, userRole;

  return {
    withName: function (name) {
      displayName = name;
      return this;
    },
    withWorkspace: function (name) {
      workspaceName = name || chance.name();
      return this;
    },
    withUser: function (email, role) {
      userEmail = email || chance.email();
      userRole = role || constants.role.basic;
      return this;
    },
    build: function (cb) {
      var company = new Company({ displayName: displayName });
      if (workspaceName) company.workspaces.push({ displayName: workspaceName });
      if (userEmail) company.workspaces[0].users.push({ email: userEmail, role: userRole });
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