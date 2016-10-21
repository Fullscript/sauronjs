let caches = {};

/* more of a singleton manager than a factory */
export default function CacheFactory(id) {
  if (!id)
    return;
  if (!caches[id])
    caches[id] = new Cache();
  return caches[id];
}

export class Cache {
  constructor() {
    this._cache = {};
  }

  get(key) {
    return this._cache[key];
  }

  exists(key) {
    return !!this.get(key);
  }

  set(key, value) {
    this._cache[key] = value;
  }

  clear() {
    this._cache = {};
  }

  keys() {
    return Object.keys(this._cache);
  }

  size() {
    return this.keys().length;
  }

  forEach(fn) {
    let keys = this.keys();
    for (let i; i < keys.length; i++)
      fn(keys[i], this.get(keys[i]))
  }
}
