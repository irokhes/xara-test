'use strict';

var mongoose = require('mongoose');

before(function() {
  mongoose.connect('mongodb://localhost:27017/xara', { useNewUrlParser: true }, function() {
    mongoose.connection.db.dropDatabase();
    require('../app');
  });
});
after(function() {

});
