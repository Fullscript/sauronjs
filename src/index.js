import { instance, broadcast, Cache, Service, Component } from './core'
export { default as util } from './util';

/* TODO: with the broadcast refactor, this event system should be removed */
export let events = {
  dom: {
    update: function() {
      var event = document.createEvent('Event');
      event.initEvent('sauron:dom:update', true, true);
      document.body.dispatchEvent(event);
    }
  }
};

/*
  Exports all main functions as named exports from this file.
  This also sauron object on window to have all named functions
*/
export { instance, broadcast, Cache, Service, Component };

/*
  Also exports all main functions on the default.
  Makes for better imports if using modules imports
 */
export default { instance, broadcast, Cache, Service, Component };
