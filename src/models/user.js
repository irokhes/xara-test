'use strict';

var constants = require('../utils/constants');
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true },
  role: { type: String, enum: [constants.role.basic, constants.role.admin] },
}, { _id: false });


UserSchema.path('email').validate(function (email) {
  var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return emailRegex.test(email); // Assuming email has a text attribute
}, 'Wrong email format.')

module.exports = UserSchema;