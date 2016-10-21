/* These specs isolate functionality to be purged */

import * as sauron from 'src';

describe('legacy specs', () => {
  describe('sauron.events.dom.update', () => {
    it('should emit sauron:dom:update', done => {
      document.addEventListener('sauron:dom:update', done);
      sauron.events.dom.update();
    });
  });
});
