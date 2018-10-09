'use strict';
var Company = require('../models/company');

var PATH = '/companies';

module.exports = function (app) {
  app.route(PATH).post(createCompany);
  app.route(PATH + '/:id').put(updateCompany);

  function createCompany(req, res) {
    var company = new Company(req.body);
    company.save(function (err, companySaved) {
      if (err) {
        res.status(400);
        res.send(err);
      } else {
        res.status(201).send(companySaved);
      }
    });
  }
  function updateCompany(req, res){
    Company.updateOne({ _id: req.params.id }, req.body, function (err) {
      if (err) {
        res.status(400);
        res.send(err);
      } else {
        res.status(204).send();
      }
    });
  }
};
