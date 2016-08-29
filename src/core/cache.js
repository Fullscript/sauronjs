'use strict';

var caches = {};

/* more of a singleton manager than a factory */
function CacheFactory(id) {
  if(!id)
    return;
  if(!caches[id])
    caches[id] = new Cache();
  return caches[id];
}

function Cache() {
  this.clear();
}

Cache.prototype.get = function(key) {
  return this._cache[key];
};

Cache.prototype.exists = function(key) {
  return !!this.get(key);
};

Cache.prototype.set = function(key, value) {
  this._cache[key] = value;
};

Cache.prototype.clear = function() {
  this._cache = {};
};

Cache.prototype.keys = function() {
  return Object.keys(this._cache);
};

Cache.prototype.size = function() {
  return this.keys().length;
};

Cache.prototype.forEach = function(fn) {
  var keys = this.keys();
  for (var i = 0; i < keys.length; i++)
    fn(keys[i], this.get(keys[i]));
};

CacheFactory.Cache = Cache;

module.exports = CacheFactory;
