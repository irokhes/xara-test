'use strict';

var Company = require('../models/company');
before(function (done) {
  require('../app');
  Company.deleteMany({}, function (err) {
    if(err) throw err;
    done();
  });
});