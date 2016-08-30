module.exports = require('./core');
module.exports.util = require('./util');

/* TODO: with the broadcast refactor, this event system should be removed */
module.exports.events = {
  dom: {
    update: function() {
      var event = document.createEvent('Event');
      event.initEvent('sauron:dom:update', true, true);
      document.body.dispatchEvent(event);
    }
  }
};
