import * as sauron from 'src';
import _instance from 'src/core/sauron';

describe('top level imports', () => {

  describe('sauron.instance', () => {
    it('should refer to the correct function', () => {
      expect(sauron.instance).toBe(_instance);
    });
  });

  describe('legacy events', () => {

  });
});
