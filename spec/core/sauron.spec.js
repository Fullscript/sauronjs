var sauron = require('src/core/sauron');
var Component = require('src/core/component');
var CacheFactory = require('src/core/cache');
var insert = require('src/util/insert');
var ready = require('src/util/ready');
var util = require('util');

ready(function() {
  describe('the eye of sauron', function() {
    // dummy component definition extends Component
    function Foo(params) {
      var self = this;
      Component.call(self, params);
    }
    util.inherits(Foo, Component);

    var sandbox = insert();

    afterEach(function() {
      sandbox.innerHTML = "";
    });

    it('bootstraps the page', function() {
      insert({
        attributes: {
          "data-fs-component": "foo"
        },
        parent: sandbox
      });
      var app = sauron.instance({
        foo: Foo
      });
      expect(app.info().total).toBe(1);
      expect(app.info().deleted).toBe(0);
      expect(app.info().saved).toBe(0);
    });

    it('tracks components with no associated constructor', function() {
      insert({
        attributes: {
          "data-fs-component": "foo"
        },
        parent: sandbox
      });
      var app = sauron.instance({
        bar: Foo
      });
      expect(app.info().total).toBe(0);
      expect(app.info().deleted).toBe(0);
      expect(app.info().saved).toBe(0);
      expect(app.info().noConstructor['foo']).toBe(true);
    });

    describe('caching', function() {
      it('scrapes the dom for text/fs-cache scripts and commits them to the cache', function() {
        var cacheElement = insert({
          attributes: {
            id: 'hello',
            type: 'text/fs-cache'
          },
          tagName: 'SCRIPT',
          parent: sandbox
        });
        cacheElement.innerHTML = "world";
        sauron.instance({});
        var cache = CacheFactory('sauron');
        expect(cache.get('hello')).toBe('world');
      });
    });

    describe("rebootstrap", function() {

      var app;
      var element;

      beforeEach(function() {
        element = insert({
          attributes: {
            "data-fs-component": "foo"
          },
          parent: sandbox
        });
        app = sauron.instance({
          foo: Foo
        });
      });

      it('saves still present components between cycles', function() {
        app.rebootstrap();
        expect(app.info().total).toBe(1);
        expect(app.info().deleted).toBe(0);
        expect(app.info().saved).toBe(1);
      });

      it('deletes dead components each cycle', function() {
        element.parentNode.removeChild(element);
        app.rebootstrap();
        expect(app.info().total).toBe(0);
        expect(app.info().deleted).toBe(1);
        expect(app.info().saved).toBe(0);
      });

    });

  });
});
