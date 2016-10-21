import CacheFactory, { Cache } from 'src/core/cache';

describe('CacheFactory', () => {
  it('does nothing when no id is specified', () => {
    let cache = CacheFactory();
    expect(cache).not.toBeDefined();
  });

  it('creates a cache for the specified id', () => {
    let cache = CacheFactory('test');
    expect(cache).toBeDefined();
  });

  it('retrieves an existing cache', () => {
    let cache = CacheFactory('test');
    let cache2 = CacheFactory('test');
    expect(cache).toBe(cache2);
  });

  it('different ids return different caches', () => {
    let cache = CacheFactory('test');
    let cache2 = CacheFactory('test2');
    expect(cache).not.toBe(cache2);
  });
});

describe('Cache', () => {
  let cache;
  beforeEach(() => {
    cache = new Cache();
  });

  describe('constructor', () => {
    it('creates an empty hash', () => {
      expect(Object.keys(cache._cache).length).toBe(0);
    });
  });

  describe('exists', () => {
    it('returns true when value is set for key', () => {
      cache._cache['hello'] = 'world';
      expect(cache.exists('hello')).toBe(true);
    });

    it('returns false when value is not set for key', () => {
      expect(cache.exists('hello')).toBe(false);
    });
  });

  describe('get', () => {
    it('returns the cached value when present', () => {
      cache._cache['hello'] = 'world';
      expect(cache.get('hello')).toBe('world');
    });

    it('returns undefined when not present', () => {
      expect(cache.get('hello')).not.toBeDefined();
    });
  });

  describe('set', () => {
    it('sets the key value pair', () => {
      cache.set('hello', 'world');
      expect(cache._cache['hello']).toBe('world');
    });
  });

  describe('keys', () => {
    it('returns an array of keys in the cache', () => {
      cache.set('hello', 'world');
      let keys = cache.keys();
      expect(Array.isArray(keys)).toBe(true);
      expect(keys.length).toBe(1);
      expect(keys[0]).toBe('hello');
    });
  });

  describe('size', () => {
    it('returns the number of keys in the cache', () => {
      expect(cache.size()).toBe(0);
    });
  });

  describe('clear', () => {
    it('clears the cache', () => {
      cache.set('hello', 'world');
      cache.clear();
      expect(Object.keys(cache._cache).length).toBe(0);
    });
  });

  describe('forEach', () => {
    it('iterates each key value pair', () => {
      cache.set('hello', 'world');
      cache.forEach((key, value) => {
        expect(key).toBe('hello');
        expect(value).toBe('world');
      });
    });
  });
});
