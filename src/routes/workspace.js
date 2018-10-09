'use strict';
var Company = require('../models/company');
var _ = require('lodash');

var PATH = '/companies/:id/workspaces';

module.exports = function (app) {
  app.route(PATH).post(createWorkspace);
  app.route(PATH + '/:wsid').put(updateWorkspace);

  function createWorkspace(req, res) {
    Company.findById(req.params.id, function (err, company) {
      if (err) {
        res.status(400);
        res.send(err);
      }

      company.workspaces.push(req.body);
      company.save(function (error, createdWorkspace) {
        if (error) {
          res.status(400);
          res.send(err);
        } else {
          res.status(201).send(createdWorkspace.workspaces);
        }
      });
    });
  }
  function updateWorkspace(req, res) {
    Company.findById(req.params.id, function (err, company) {
      var elem = _.find(company.workspaces, function (ws) { return ws._id.toString() === req.params.wsid; });
      if (elem) {
        elem.displayName = req.body.displayName;
      }
      company.save(function (error) {
        if (error) {
          res.status(400);
          res.send(err);
        } else {
          res.status(204).send();
        }
      });
    });
  }
};
