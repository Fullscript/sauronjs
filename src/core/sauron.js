'use strict';

var Cache = require('./cache');

function Info() {
  this.noConstructor = {};
  this.created = 0;
  this.saved = 0;
  this.deleted = 0;
}

Object.defineProperty(Info.prototype, 'total', {
  get: function() {
    return this.created + this.saved;
  }
});

function initCache(id) {
  var cache = Cache(id);
  var nodes = document.querySelectorAll('script[type="text/fs-cache"]');
  for (var i = 0; i < nodes.length; i++)
    cache.set(nodes[i].id, nodes[i].textContent.trim());
}

function bootstrap(componentMap, oldComponents) {
  componentMap = componentMap || {};
  oldComponents = oldComponents || {};
  var components = {};
  var info = new Info();
  var elements = document.querySelectorAll('[data-fs-component]');
  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    var id = element.getAttribute('data-fs-bootstrap-id');
    if (id && oldComponents[id]) {
      components[id] = oldComponents[id];
      info.saved++;
    } else {
      var ctorName = element.getAttribute('data-fs-component').trim();
      var ctor = componentMap[ctorName];
      if (ctor) {
        var component = new ctor({
          element: element
        });
        components[component.id] = component;
        info.created++;
      } else
        info.noConstructor[ctorName] = true;
    }
  }
  info.deleted = cleanup(components, oldComponents);
  return {
    components: components,
    info: info
  };
}

function cleanup(newComponents, oldComponents) {
  var componentIds = Object.keys(oldComponents);
  var count = 0;
  for (var i = 0; i < componentIds.length; i++) {
    var id = componentIds[i];
    if (!newComponents[id]) {
      oldComponents[id].destroy();
      count++;
    }
  }
  return count;
}

function instance(componentMap, id) {
  var lastBootstrap = {};
  id = id || 'sauron';

  function rebootstrap(map) {
    map = map || componentMap;
    lastBootstrap = bootstrap(map, lastBootstrap.components);
  }

  initCache(id);
  rebootstrap();

  return {
    rebootstrap: rebootstrap,
    info: function() {
      lastBootstrap.info.id = id;
      return lastBootstrap.info;
    },
    plugin: function(plugin, options) {
      plugin(this, options || {});
      return this;
    },
    service: function(Service, options) {
      new Service(options);
      return this;
    },
    initCache: initCache
  };
}

module.exports = instance;
