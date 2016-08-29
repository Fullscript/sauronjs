/* BEGIN LEGACY EXPORTS */
exports.insert = require('./util/insert');
exports.instance = require('./core/sauron');
exports.Component = require('./core/component');

/* BEGIN CUSTOM EVENTS AVOID USING */
/* TODO: with the broadcast refactor, this event system should be removed */
function dispatchEvent(eventName) {
  var event = document.createEvent('Event');
  event.initEvent(eventName, true, true);
  document.body.dispatchEvent(event);
}

exports.events = {
  dom: {
    update: function() {
      dispatchEvent('sauron:dom:update');
    }
  }
};
/* END CUSTOM EVENTS */
/* END LEGACY EXPORTS */

// EXPORTS
exports.util = require('./util');
