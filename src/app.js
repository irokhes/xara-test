/**
 * Module dependencies.
 */
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var _ = require('lodash');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
var http = require('http').Server(app);
require('./models/db');
var Company = require('./models/company');

app.route('/companies').post(function (req, res) {
  var company = new Company(req.body);
  company.save(function (err, companySaved) {
    if (err) {
      res.status(400);
      res.send(err);
    } else {
      res.status(201).send(companySaved);
    }
  });
});
app.route('/companies/:id').put(function (req, res) {
  Company.updateOne({ _id: req.params.id }, req.body, function (err, result) {
    if (err) {
      res.status(400);
      res.send(err);
    } else {
      res.status(204).send();
    }
  });
});
app.route('/companies/:id/workspaces').post(function (req, res) {
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
});
app.route('/companies/:id/workspaces/:wsid').put(function (req, res) {
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
});
app.route('/companies/:id/workspaces/:wsid/users').post(function (req, res) {
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
        res.status(200).send(workspace.users);
      }
    });
  });
});
app.route('/companies/:id/workspaces/:wsid/users/:userid').put(function (req, res) {
  Company.updateOne({ _id: req.params.id, 'workspaces._id': req.params.wsid, 'workspaces.users._id': req.params.userid }, { $set: { 'workspaces.0.users.0.email': req.body.email, 'workspaces.0.users.0.role': req.body.rolel } }, function (err, result) {
    if (err) {
      res.status(400);
      res.send(err);
    } else {
      res.status(200).send(result);
    }
  });
});
http.listen(3090, function () {
  console.log('Express server listening on port' + 3090);
});
