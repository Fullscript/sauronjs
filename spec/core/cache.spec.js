var CacheFactory = require('core/cache');

describe('CacheFactory', function() {
  it('does nothing when no id is specified', function() {
    var cache = CacheFactory();
    expect(cache).not.toBeDefined();
  });

  it('creates a cache for the specified id', function() {
    var cache = CacheFactory('test');
    expect(cache).toBeDefined();
  });

  it('retrieves an existing cache', function() {
    var cache = CacheFactory('test');
    var cache2 = CacheFactory('test');
    expect(cache).toBe(cache2);
  });

  it('different ids return different caches', function() {
    var cache = CacheFactory('test');
    var cache2 = CacheFactory('test2');
    expect(cache).not.toBe(cache2);
  });
});

describe('Cache', function() {
  var cache;
  beforeEach(function() {
    cache = new CacheFactory.Cache();
  });

  describe('constructor', function() {
    it('creates an empty hash', function() {
      expect(Object.keys(cache._cache).length).toBe(0);
    });
  });

  describe('exists', function() {
    it('returns true when value is set for key', function() {
      cache._cache['hello'] = 'world';
      expect(cache.exists('hello')).toBe(true);
    });

    it('returns false when value is not set for key', function() {
      expect(cache.exists('hello')).toBe(false);
    });
  });

  describe('get', function() {
    it('returns the cached value when present', function() {
      cache._cache['hello'] = 'world';
      expect(cache.get('hello')).toBe('world');
    });

    it('returns undefined when not present', function() {
      expect(cache.get('hello')).not.toBeDefined();
    });
  });

  describe('set', function() {
    it('sets the key value pair', function() {
      cache.set('hello', 'world');
      expect(cache._cache['hello']).toBe('world');
    });
  });

  describe('keys', function() {
    it('returns an array of keys in the cache', function() {
      cache.set('hello', 'world');
      var keys = cache.keys();
      expect(Array.isArray(keys)).toBe(true);
      expect(keys.length).toBe(1);
      expect(keys[0]).toBe('hello');
    });
  });

  describe('size', function() {
    it('returns the number of keys in the cache', function() {
      expect(cache.size()).toBe(0);
    });
  });

  describe('clear', function() {
    it('clears the cache', function() {
      cache.set('hello', 'world');
      cache.clear();
      expect(Object.keys(cache._cache).length).toBe(0);
    });
  });

  describe('forEach', function() {
    it('iterates each key value pair', function() {
      cache.set('hello', 'world');
      cache.forEach(function(key, value) {
        expect(key).toBe('hello');
        expect(value).toBe('world');
      });
    });
  });
});
