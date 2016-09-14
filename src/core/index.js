import instance from './sauron';
import broadcast from './broadcast';
import Cache from './cache';
import { Service } from './service';
import { Component } from './component';

export { default as instance } from  './sauron';
export { default as broadcast } from './broadcast';
export { default as Cache } from './cache';
export { Service } from './service';
export { Component } from './component';

export default {
  instance,
  broadcast,
  Cache,
  Service,
  Component
}
