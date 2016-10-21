/* These specs ensure import paths are non-breaking between updates */

import * as sauron from 'src';
import { instance, cache, Component, Service } from 'src';

import _instance from 'src/core/sauron';
import _cache  from 'src/core/cache';
import _Component from 'src/core/component';
import _Service from 'src/core/service';
import _ready from 'src/util/ready';
import _insert from 'src/util/insert';

const EXPECTATION_MSG = 'should refer to the correct function';

describe('top level imports', () => {

  describe('instance', () => {
    it(EXPECTATION_MSG, () => {
      expect(sauron.instance).toBe(_instance);
    });
  });

  describe('cache', () => {
    it(EXPECTATION_MSG, () => {
      expect(sauron.cache).toBe(_cache);
    });
  });

  describe('Component', () => {
    it(EXPECTATION_MSG, () => {
      expect(sauron.Component).toBe(_Component);
    });
  });

  describe('Service', () => {
    it(EXPECTATION_MSG, () => {
      expect(sauron.Service).toBe(_Service);
    });
  });

});

describe('named imports', () => {
  describe('instance', () => {
    it(EXPECTATION_MSG, () => {
      expect(instance).toBe(_instance);
    });
  });

  describe('cache', () => {
    it(EXPECTATION_MSG, () => {
      expect(cache).toBe(_cache);
    });
  });

  describe('Component', () => {
    it(EXPECTATION_MSG, () => {
      expect(Component).toBe(_Component);
    });
  });

  describe('Service', () => {
    it(EXPECTATION_MSG, () => {
      expect(Service).toBe(_Service);
    });
  });
});

describe('util', () => {
  describe('ready', () => {
    it(EXPECTATION_MSG, () => {
      expect(sauron.util.ready).toBe(_ready);
    });
  });

  describe('insert', () => {
    it(EXPECTATION_MSG, () => {
      expect(sauron.util.insert).toBe(_insert);
    });
  });
});
