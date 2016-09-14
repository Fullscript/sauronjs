import { Subject } from 'rxjs/Rx';

let subject = new Subject();

function filter(broadcast) {
  // if id is present, reject anything self emitted
  if(broadcast.id && broadcast.id === this.id)
    return false;
  // for all channels the broadcast was on, if this was registered on one allow event
  for(let i = 0; i < broadcast.channels.length; i++) {
    let channel = broadcast.channels[i];
    if(this.subChannelsHash[channel])
      return true;
  }
  // otherwise ignore event
  return false;
}

export function attachSubject(object) {
  object.broadcastSubject = new Subject()
    .filter(filter.bind(object));
  return subject.subscribe(object.broadcastSubject);
}

export function next(channels, event, data, id) {
  subject.next({
    channels: channels,
    event: event,
    data: data,
    id: id
  });
}

export default {
  attachSubject,
  next
}
