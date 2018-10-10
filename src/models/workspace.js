'use strict';

var UserSchema = require('./user');
var mongoose = require('mongoose');
var _ = require('lodash');

var WorkspaceSchema = new mongoose.Schema({
  _id: {auto: true, type: mongoose.Schema.ObjectId, index: true},
  displayName: { type: String, required: true },
  name: { type: String, index:true },
  users: [UserSchema]
});

WorkspaceSchema.pre('save', function (next) {
  this.name = this.displayName.toLowerCase();
  hasDuplicates(this.users, 'email') ? next(new Error('Duplicate email')) : next();
});

WorkspaceSchema.methods.addUser = function(user){
  this.users.push(user);
}
WorkspaceSchema.methods.removeUser = function(email){
  var userRemoved = _.remove(this.users, function(usr){return usr.email === email});
  if(userRemoved) this.markModified('users');
}

function hasDuplicates(a, property) {
  return _.uniqBy(a, property).length !== a.length;
}

module.exports = WorkspaceSchema;