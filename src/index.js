import * as core from './core';
export default core;
export * from './core';
// unintuitive export syntax but it works http://jamesknelson.com/re-exporting-es6-modules/
export { default as util } from './util';

/* TODO: with the broadcast refactor, this event system should be removed */
export let events = {
  dom: {
    update() {
      var event = document.createEvent('Event');
      event.initEvent('sauron:dom:update', true, true);
      document.body.dispatchEvent(event);
    }
  }
};
