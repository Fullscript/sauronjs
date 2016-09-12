function MyComponent(params) {
  sauron.Component.call(this, params);
  this.element.innerHTML = "This is sauron";
}
MyComponent.prototype = Object.create(sauron.Component.prototype);
MyComponent.prototype.constructor = MyComponent;
