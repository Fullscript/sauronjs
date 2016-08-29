'use strict';

function insert(params) {
  params = params || {};
  var element = document.createElement(params.tagName || 'DIV');
  if(params.attributes) {
    setAttributes(element, params.attributes);
  }
  var parentElement = params.parent || document.body;
  parentElement.appendChild(element);
  return element;
}

// also a useful util function
function setAttributes(element, attributes) {
  var attrKeys = Object.keys(attributes);
  for(var i = 0; i < attrKeys.length; i++) {
    var attr = attrKeys[i];
    element.setAttribute(attr, attributes[attr])
  }
}

module.exports = insert;
