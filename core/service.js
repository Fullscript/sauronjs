'use strict';

var broadcast = require('health_wave/modules/broadcast');

function Service(pubs, subs) {
  this.pubChannels = pubs;
  this.subChannelsHash = {};
  for(var i = 0; i < subs.length; i++) {
    this.subChannelsHash[subs[i]] = true;
  }
  broadcast.attachSubject(this);
}

Service.prototype.broadcast = function(event, data) {
  broadcast.next(this.pubChannels, event, data);
};

module.exports = Service;
