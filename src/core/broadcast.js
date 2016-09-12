'use strict';

var Rx = require('rxjs/Rx');
var Subject = Rx.Subject;

var subject = new Subject();

function next(channels, event, data, id) {
  subject.next({
    channels: channels,
    event: event,
    data: data,
    id: id
  });
}

function filter(broadcast) {
  // if id is present, reject anything self emitted
  if(broadcast.id && broadcast.id === this.id)
    return false;
  // for all channels the broadcast was on, if this was registered on one allow event
  for(var i = 0; i < broadcast.channels.length; i++) {
    var channel = broadcast.channels[i];
    if(this.subChannelsHash[channel])
      return true;
  }
  // otherwise ignore event
  return false;
}

function attachSubject(object) {
  object.broadcastSubject = new Subject()
    .filter(filter.bind(object));
  return subject.subscribe(object.broadcastSubject);
}

exports.next = next;
exports.attachSubject = attachSubject;
