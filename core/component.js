'use strict';

var broadcast = require('./broadcast');

function strToHash(str) {
  var hash = {};
  if(!!str) {
    var tokens = str.split(',');
    for(var i = 0; i < tokens.length; i++) {
      var token = tokens[i].trim();
      hash[token] = true;
    }
  }
  return hash;
}

function strToArray(str) {
  // im lazy..
  return Object.keys(strToHash(str));
}

function Component(params) {
  this.element = params.element;
  this.id = ++Component._index;
  this.attr('data-fs-bootstrap-id', this.id);
  this.pubChannels = strToArray(this.attr('data-fs-pub'));
  this.subChannelsHash = strToHash(this.attr('data-fs-sub'));
  this.subscriptions = [];
  this.globalSubjectSubscription = broadcast.attachSubject(this);
  this.state = params.state || {};
}

// this is the incrementing unique identifier for a component
Component._index = 0;

Component.prototype.broadcast = function(event, data) {
  broadcast.next(this.pubChannels, event, data, this.id);
};

Component.prototype.destroy = function() {
  this.globalSubjectSubscription.unsubscribe();
  this.broadcastSubject.complete();
  for(var i = 0; i < this.subscriptions.length; i++)
    if(!this.subscriptions[i].isUnsubscribed)
      this.subscriptions[i].unsubscribe();
};

Component.prototype.registerSubscription = function(subscriptions) {
  if(!Array.isArray(subscriptions))
    subscriptions = [subscriptions];
  for(var i = 0; i < subscriptions.length; i++)
    this.subscriptions.push(subscriptions[i]);
};

Component.prototype.subscribe = function(observables) {
  if(!Array.isArray(observables))
    observables = [observables];
  for(var i = 0; i < observables.length; i++)
    this.subscriptions.push(observables[i].subscribe());
};

/* element.querySelector shortcut */
Component.prototype.find = function(selector) {
  return this.element.querySelector(selector);
};

/* element.querySelectorAll shortcut */
Component.prototype.findAll = function(selector) {
  return this.element.querySelectorAll(selector);
};

/* element.(get|set)Attribute shortcut */
Component.prototype.attr = function(key, value) {
  if(!!value)
    this.element.setAttribute(key, value);
  else
    return this.element.getAttribute(key)
};

module.exports = Component;
