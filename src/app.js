'use strict';

var config = require('./utils/config');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
var http = require('http').Server(app);
require('./models/db');
require('./routes')(app);

http.listen(config.settings.port, function () {
  console.log('Express server listening on port ' + config.settings.port);
});
