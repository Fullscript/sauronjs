import Cache from './cache';

class Info {
  constructor(){
    this.noConstructor = {};
    this.created = 0;
    this.saved = 0;
    this.deleted = 0;
  }

  get total(){
    return this.created + this.saved;
  }
}

function initCache(id) {
  let cache = Cache(id);
  let nodes = document.querySelectorAll('script[type="text/fs-cache"]');
  for (let i = 0; i < nodes.length; i++)
    cache.set(nodes[i].id, nodes[i].textContent.trim());
}

function bootstrap(componentMap, oldComponents) {
  componentMap = componentMap || {};
  oldComponents = oldComponents || {};
  let components = {};
  let info = new Info();
  let elements = document.querySelectorAll('[data-fs-component]');
  for (let i = 0; i < elements.length; i++) {
    let element = elements[i];
    let id = element.getAttribute('data-fs-bootstrap-id');
    if (id && oldComponents[id]) {
      components[id] = oldComponents[id];
      info.saved++;
    } else {
      let ctorName = element.getAttribute('data-fs-component').trim();
      let ctor = componentMap[ctorName];
      if (ctor) {
        let component = new ctor({
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
  let componentIds = Object.keys(oldComponents);
  let count = 0;
  for (let i = 0; i < componentIds.length; i++) {
    let id = componentIds[i];
    if (!newComponents[id]) {
      oldComponents[id].destroy();
      count++;
    }
  }
  return count;
}

function instance(componentMap, id) {
  let lastBootstrap = {};
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

export default instance;
