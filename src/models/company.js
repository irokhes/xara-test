'use strict';
var mongoose = require('mongoose');
var _ = require('lodash');

var WorkspaceSchema = require('./workspace');

var CompanySchema = new mongoose.Schema({
  displayName: { type: String, required: true },
  name: { type: String },
  workspaces: [WorkspaceSchema]
});

function hasDuplicates(a, property) {
  return _.uniqBy(a, property).length !== a.length;
}

CompanySchema.pre('save', function (next) {
  this.name = this.displayName && this.displayName.toLowerCase();
  hasDuplicates(this.workspaces, 'name') ? next(new Error('Duplicate workspace')) : next();
});

CompanySchema.pre('update', function (next) {
  if (this._update.displayName) this._update.name = this._update.displayName.toLowerCase();
  next();
});

CompanySchema.methods.addWorkspace = function(workspace){
  this.workspaces.push(workspace);
}
CompanySchema.methods.updateWorkspace = function(wsid, newWorkspaceInfo){
  var elem = _.find(this.workspaces, function (ws) { return ws._id.toString() === wsid; });
  if (elem) elem.displayName = newWorkspaceInfo.displayName;
}

CompanySchema.index({ 'name': 1, }, { unique: true });

module.exports = mongoose.model('Company', CompanySchema);