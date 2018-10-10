'use strict';
var _ = require('lodash');

var Company = require('../models/company');
var PATH = '/companies/:id/workspaces/:wsid/users';

module.exports = function (app) {
  app.route(PATH).post(createUser);
  app.route(PATH + '/:email').delete(deleteUser);

  function createUser(req,res){
    Company.findById(req.params.id, function (err, company) {
      if (err) {
        res.status(400);
        return res.send(err);
      }
      var workspace = _.find(company.workspaces, function (ws) { return ws._id.toString() === req.params.wsid; });
      workspace.addUser(req.body);
      company.save(function (error) {
        if (error) {
          res.status(400);
          return res.send(error);
        } 
        res.status(201).send(workspace.users);
      });
    });
  }
  function deleteUser(req,res){
    Company.findById(req.params.id, function (err, company) {
      var workspace = _.find(company.workspaces, function (ws) { return ws._id.toString() === req.params.wsid; });
      if (!workspace) {
        return res.status(400).json('Invalid company ID')
      }
      workspace.removeUser(req.params.email);
      company.save(function (error) {
        if (error) {
          res.status(400);
          return res.send(err);
        } 
        res.status(204).send();
      });
    });
  }
}