'use strict';
var _ = require('lodash');

var Company = require('../models/company');
var PATH = '/companies/:id/workspaces/:wsid/users';

module.exports = function (app) {
  app.route(PATH).post(createUser);
  app.route(PATH + '/:userid').put(updateUser);

  function createUser(req,res){
    Company.findById(req.params.id, function (err, company) {
      if (err) {
        res.status(400);
        res.send(err);
      }
      var workspace = _.find(company.workspaces, function (ws) { return ws._id.toString() === req.params.wsid; });
      workspace.users.push(req.body);
      company.save(function (error) {
        if (error) {
          res.status(400);
          res.send(err);
        } else {
          res.status(201).send(workspace.users);
        }
      });
    });
  }
  function updateUser(req,res){
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
}