'use strict';
var Company = require('../models/company');
var _ = require('lodash');

var PATH = '/companies/:id/workspaces';

module.exports = function (app) {
  app.route(PATH).post(createWorkspace);
  app.route(PATH + '/:wsid').patch(updateWorkspace);

  function createWorkspace(req, res) {
    Company.findById(req.params.id, function (err, company) {
      if (err) {
        res.status(400);
        return res.send(err);
      }

      company.addWorkspace(req.body);
      company.save(function (error, createdWorkspace) {
        if (error) {
          res.status(400);
          return res.send(err);
        }
        res.status(201).send(createdWorkspace.workspaces);
      });
    });
  }
  function updateWorkspace(req, res) {
    Company.findById(req.params.id, function (err, company) {
      company.updateWorkspace(req.params.wsid, req.body)
      company.save(function (error) {
        if (error) {
          res.status(400);
          return res.send(err);
        }
        res.status(204).send();
      });
    });
  }
};
