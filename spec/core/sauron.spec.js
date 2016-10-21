import sauron from 'src/core/sauron';
import Component from 'src/core/component';
import CacheFactory from 'src/core/cache';
import { insert, ready } from 'src/util';

ready(() => {
  describe('the eye of sauron', () => {
    // dummy component definition extends Component
    class Foo extends Component {
      constructor(params) {
        super(params)
      }
    }

    let sandbox = insert();

    afterEach(() => {
      sandbox.innerHTML = "";
    });

    it('bootstraps the page', () => {
      insert({
        attributes: {
          "data-fs-component": "foo"
        },
        parent: sandbox
      });
      let app = sauron({
        foo: Foo
      });
      expect(app.info().total).toBe(1);
      expect(app.info().deleted).toBe(0);
      expect(app.info().saved).toBe(0);
    });

    it('tracks components with no associated constructor', () => {
      insert({
        attributes: {
          "data-fs-component": "foo"
        },
        parent: sandbox
      });
      let app = sauron({
        bar: Foo
      });
      expect(app.info().total).toBe(0);
      expect(app.info().deleted).toBe(0);
      expect(app.info().saved).toBe(0);
      expect(app.info().noConstructor['foo']).toBe(true);
    });

    describe('caching', () => {
      it('scrapes the dom for text/fs-cache scripts and commits them to the cache', () => {
        let cacheElement = insert({
          attributes: {
            id: 'hello',
            type: 'text/fs-cache'
          },
          tagName: 'SCRIPT',
          parent: sandbox
        });
        cacheElement.innerHTML = "world";
        sauron({});
        let cache = CacheFactory('sauron');
        expect(cache.get('hello')).toBe('world');
      });
    });

    describe("rebootstrap", () => {

      let app;
      let element;

      beforeEach(() => {
        element = insert({
          attributes: {
            "data-fs-component": "foo"
          },
          parent: sandbox
        });
        app = sauron({
          foo: Foo
        });
      });

      it('saves still present components between cycles', () => {
        app.rebootstrap();
        expect(app.info().total).toBe(1);
        expect(app.info().deleted).toBe(0);
        expect(app.info().saved).toBe(1);
      });

      it('deletes dead components each cycle', () => {
        element.parentNode.removeChild(element);
        app.rebootstrap();
        expect(app.info().total).toBe(0);
        expect(app.info().deleted).toBe(1);
        expect(app.info().saved).toBe(0);
      });
    });
  });
});
