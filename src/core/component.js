import * as broadcast from './broadcast';

function strToHash(str) {
  let hash = {};
  if(str) {
    let tokens = str.split(',');
    for(let i = 0; i < tokens.length; i++) {
      let token = tokens[i].trim();
      hash[token] = true;
    }
  }
  return hash;
}

function strToArray(str) {
  // im lazy..
  return Object.keys(strToHash(str));
}

export default class Component {
  constructor(params){
    this.element = params.element;
    this.id = ++Component._index;
    this.attr('data-fs-bootstrap-id', this.id);
    this.pubChannels = strToArray(this.attr('data-fs-pub'));
    this.subChannelsHash = strToHash(this.attr('data-fs-sub'));
    this.subscriptions = [];
    this.globalSubjectSubscription = broadcast.attachSubject(this);
    this.state = params.state || {};
  }

  broadcast(event, data){
    broadcast.next(this.pubChannels, event, data, this.id);
  }

  destroy(){
    this.globalSubjectSubscription.unsubscribe();
    this.broadcastSubject.complete();
    for(let i = 0; i < this.subscriptions.length; i++)
      if(!this.subscriptions[i].isUnsubscribed)
        this.subscriptions[i].unsubscribe();
  }

  registerSubscription(subscriptions){
    if(!Array.isArray(subscriptions))
      subscriptions = [subscriptions];
    for(let i = 0; i < subscriptions.length; i++)
      this.subscriptions.push(subscriptions[i]);
  }

  subscribe(observables){
    if(!Array.isArray(observables))
      observables = [observables];
    for(let i = 0; i < observables.length; i++)
      this.subscriptions.push(observables[i].subscribe());
  }

  /* element.querySelector shortcut */
  find(selector){
    return this.element.querySelector(selector);
  }

  /* element.querySelectorAll shortcut */
  findAll(selector){
    return this.element.querySelectorAll(selector);
  }

  /* element.(get|set)Attribute shortcut */
  attr(key, value){
    if(typeof(value) !== 'undefined')
      this.element.setAttribute(key, value);
    else
      return this.element.getAttribute(key);
  }
}
Component._index = 0;
