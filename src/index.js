import * as core from './core';
import * as util from './util';
export default core;
export * from './core';
export { util as util };

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
