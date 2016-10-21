import { Observable } from 'rxjs/Rx';
import Component from 'src/core/component';
import { insert, ready } from 'src/util';

ready(() => {
  describe("Component", () => {

    describe("constructor", () => {
      let params;

      beforeEach(() => {
        params = {
          element: document.createElement('DIV')
        };
      });

      it("sets the element reference", () => {
        let component = new Component(params);
        expect(component.element).toBe(params.element);
      });

      it("sets the element id", () => {
        let component = new Component(params);
        expect(component.id).toBe(Component._index);
      });

      it("sets the id to the html element", () => {
        let component = new Component(params);
        expect(component.element.getAttribute('data-fs-bootstrap-id')).toBe(Component._index.toString());
      });

      it("creates a state object", () => {
        let component = new Component(params);
        expect(Object.keys(component.state).length).toBe(0);
      });

      it('sets the state object if passed in params', () => {
        params.state = {};
        let component = new Component(params);
        expect(component.state).toBe(params.state);
      });

      it("creates an array for pushing subscriptions to be cleaned", () => {
        let component = new Component(params);
        expect(Array.isArray(component.subscriptions)).toBe(true);
      });

      describe("pub/sub", () => {
        let channels = ['channel1', 'channel2'];

        beforeEach(() => {
          let joinedChannels = channels.join(',');
          params.element.setAttribute('data-fs-pub', joinedChannels);
          params.element.setAttribute('data-fs-sub', joinedChannels);
        });

        it("creates a hash of its subscribed channels", () => {
          let component = new Component(params);
          expect(typeof component.subChannelsHash).toBe('object');
          expect(Object.keys(component.subChannelsHash).length).toBe(channels.length);
        });

        it("creates an array of its publishing channels", () => {
          let component = new Component(params);
          expect(Array.isArray(component.pubChannels)).toBe(true);
          expect(component.pubChannels.length).toBe(channels.length);
        });

      });

    });

    describe("destroy", () => {
      let component;

      beforeEach(() => {
        component = new Component({
          element: document.createElement('DIV')
        });
      });

      it("unsubscribes from the proxied broadcasts", () => {
        let sub = component.broadcastSubject.subscribe();
        component.destroy();
        expect(sub.isUnsubscribed).toBe(true);
      });

      it("unsubscribes from all subscriptions", () => {
        component.registerSubscription([Observable.of(1).subscribe(), Observable.of(2).subscribe()]);
        component.destroy();
        expect(component.subscriptions.length).toBe(2)
        for (let i = 0; i < component.subscriptions.length; i++) {
          expect(component.subscriptions[i].isUnsubscribed).toBe(true);
        }
      })

    });

    describe("registerSubscription", () => {
      let component;

      beforeEach(() => {
        component = new Component({
          element: document.createElement('DIV')
        });
      });

      it('registers a single subscription', () => {
        let sub = {};
        component.registerSubscription(sub);
        expect(component.subscriptions.length).toBe(1);
      });

      it('registers an array of subscriptions', () => {
        let subs = [{}, {}];
        component.registerSubscription(subs);
        expect(component.subscriptions.length).toBe(2);
      });

    });

    describe("broadcast", () => {
      let component;
      let component2;

      beforeEach(() => {
        let element = document.createElement('DIV');
        element.setAttribute('data-fs-sub', 'chan');
        component = new Component({
          element: element
        });
        let element2 = document.createElement('DIV');
        element2.setAttribute('data-fs-pub', 'chan');
        component2 = new Component({
          element: element2
        });
      });

      it('can trigger broadcasts', done => {
        component.broadcastSubject.subscribe(broadcast => {
          expect(broadcast.event).toBe('event');
          expect(broadcast.data).toBe('a message');
          done();
        });
        component2.broadcast('event', 'a message');
      });
    });

    describe("DOM shortcuts", () => {
      let component;
      let elem;

      beforeEach(() => {
        elem = insert();
        component = new Component({
          element: elem
        });
      });

      describe("find", () => {
        it('searches down its DOM tree for first match', () => {
          let child = insert({
            parent: elem,
            tagName: 'DIV'
          });
          expect(component.find('div')).toBe(child);
        });

        it('does not find matches outside its DOM tree', () => {
          let outside = insert({
            tagName: 'DIV'
          });
          expect(component.find('div')).toBeNull();
        });
      });

      describe("findAll", () => {
        it('like find, but returns a NodeList', () => {
          let child = insert({
            parent: elem,
            tagName: 'DIV'
          });
          let results = component.findAll('div');
          expect(results.length).toBe(1);
          expect(results[0]).toBe(child);
        });
      });

      describe("attr", () => {
        it('gets attributes from the component element', () => {
          component.element.setAttribute('data-test', 'test');
          expect(component.attr('data-test')).toBe('test');
        });

        it('sets attributes to the component element', () => {
          component.attr('data-test', 'test');
          expect(component.element.getAttribute('data-test')).toBe('test');
        });
      });
    });
  });
});
