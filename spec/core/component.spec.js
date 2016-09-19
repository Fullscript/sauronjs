import { Observable } from 'rxjs/Rx';
import Component from 'src/core/component';
import { insert, ready } from 'src/util';

ready(function() {
  describe("Component", function() {

    describe("constructor", function() {
      let params;

      beforeEach(function() {
        params = {
          element: document.createElement('DIV')
        };
      });

      it("sets the element reference", function() {
        let component = new Component(params);
        expect(component.element).toBe(params.element);
      });

      it("sets the element id", function() {
        let component = new Component(params);
        expect(component.id).toBe(Component._index);
      });

      it("sets the id to the html element", function() {
        let component = new Component(params);
        expect(component.element.getAttribute('data-fs-bootstrap-id')).toBe(Component._index.toString());
      });

      it("creates a state object", function() {
        let component = new Component(params);
        expect(Object.keys(component.state).length).toBe(0);
      });

      it('sets the state object if passed in params', function() {
        params.state = {};
        let component = new Component(params);
        expect(component.state).toBe(params.state);
      });

      it("creates an array for pushing subscriptions to be cleaned", function() {
        let component = new Component(params);
        expect(Array.isArray(component.subscriptions)).toBe(true);
      });

      describe("pub/sub", function() {
        let channels = ['channel1', 'channel2'];

        beforeEach(function() {
          let joinedChannels = channels.join(',');
          params.element.setAttribute('data-fs-pub', joinedChannels);
          params.element.setAttribute('data-fs-sub', joinedChannels);
        });

        it("creates a hash of its subscribed channels", function() {
          let component = new Component(params);
          expect(typeof component.subChannelsHash).toBe('object');
          expect(Object.keys(component.subChannelsHash).length).toBe(channels.length);
        });

        it("creates an array of its publishing channels", function() {
          let component = new Component(params);
          expect(Array.isArray(component.pubChannels)).toBe(true);
          expect(component.pubChannels.length).toBe(channels.length);
        });

      });

    });

    describe("destroy", function() {
      let component;

      beforeEach(function() {
        component = new Component({
          element: document.createElement('DIV')
        });
      });

      it("unsubscribes from the proxied broadcasts", function() {
        let sub = component.broadcastSubject.subscribe();
        component.destroy();
        expect(sub.isUnsubscribed).toBe(true);
      });

      it("unsubscribes from all subscriptions", function() {
        component.registerSubscription([Observable.of(1).subscribe(), Observable.of(2).subscribe()]);
        component.destroy();
        expect(component.subscriptions.length).toBe(2)
        for (let i = 0; i < component.subscriptions.length; i++) {
          expect(component.subscriptions[i].isUnsubscribed).toBe(true);
        }
      })

    });

    describe("registerSubscription", function() {
      let component;

      beforeEach(function() {
        component = new Component({
          element: document.createElement('DIV')
        });
      });

      it('registers a single subscription', function() {
        let sub = {};
        component.registerSubscription(sub);
        expect(component.subscriptions.length).toBe(1);
      });

      it('registers an array of subscriptions', function() {
        let subs = [{}, {}];
        component.registerSubscription(subs);
        expect(component.subscriptions.length).toBe(2);
      });

    });

    describe("broadcast", function() {
      let component;
      let component2;

      beforeEach(function() {
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

      it('can trigger broadcasts', function(done) {
        component.broadcastSubject.subscribe(function(broadcast) {
          expect(broadcast.event).toBe('event');
          expect(broadcast.data).toBe('a message');
          done();
        });
        component2.broadcast('event', 'a message');
      });
    });

    describe("DOM shortcuts", function() {
      let component;
      let elem;

      beforeEach(function() {
        elem = insert();
        component = new Component({
          element: elem
        });
      });

      describe("find", function() {
        it('searches down its DOM tree for first match', function() {
          let child = insert({
            parent: elem,
            tagName: 'DIV'
          });
          expect(component.find('div')).toBe(child);
        });

        it('does not find matches outside its DOM tree', function() {
          let outside = insert({
            tagName: 'DIV'
          });
          expect(component.find('div')).toBeNull();
        });
      });

      describe("findAll", function() {
        it('like find, but returns a NodeList', function() {
          let child = insert({
            parent: elem,
            tagName: 'DIV'
          });
          let results = component.findAll('div');
          expect(results.length).toBe(1);
          expect(results[0]).toBe(child);
        });
      });

      describe("attr", function() {
        it('gets attributes from the component element', function() {
          component.element.setAttribute('data-test', 'test');
          expect(component.attr('data-test')).toBe('test');
        });

        it('sets attributes to the component element', function() {
          component.attr('data-test', 'test');
          expect(component.element.getAttribute('data-test')).toBe('test');
        });
      });

    });

  });
});
