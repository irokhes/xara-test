'use strict';

var mongoose = require('mongoose');
var _ = require('lodash');
var UserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    role: { type: String, enum: ['basic', 'admin'] },
});
var WorkspaceSchema = new mongoose.Schema({
    displayName: { type: String, required: true },
    name: { type: String },
    users: [UserSchema]
});

var CompanySchema = new mongoose.Schema({
    displayName: { type: String, required: true },
    name: { type: String },
    workspaces: [WorkspaceSchema]
});

UserSchema.path('email').validate(function (email) {
    var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email); // Assuming email has a text attribute
}, 'Wrong email format.')

function hasDuplicates(a) {
    return _.uniqBy(a,'name').length !== a.length; 
  }
  
WorkspaceSchema.pre('save', function (next) {
    this.name = this.displayName.toLowerCase();;
    next();
});

CompanySchema.pre('save', function (next) {
    this.name = this.displayName && this.displayName.toLowerCase();
    hasDuplicates(this.workspaces) ? next(new Error('errorr!!!')) : next();
});
CompanySchema.pre('update', function (next) {
    if(this._update.displayName) this._update.name = this._update.displayName.toLowerCase();
    next();
});

CompanySchema.index({ 'name': 1, }, {   unique: true });

module.exports = mongoose.model('Company', CompanySchema);