export * from './core';
import * as util from './util';
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
