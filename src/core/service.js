import broadcast from './broadcast';

export default class Service {
  constructor (pubs, subs) {
    this.pubChannels = pubs;
    this.subChannelsHash = {};
    for(let i = 0; i < subs.length; i++) {
      this.subChannelsHash[subs[i]] = true;
    }
    broadcast.attachSubject(this);
  }

  broadcast(event, data){
    broadcast.next(this.pubChannels, event, data);
  }
}
