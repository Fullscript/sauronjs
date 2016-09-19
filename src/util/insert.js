export default function insert(params) {
  params = params || {};
  let element = document.createElement(params.tagName || 'DIV');
  if(params.attributes) {
    setAttributes(element, params.attributes);
  }
  let parentElement = params.parent || document.body;
  parentElement.appendChild(element);
  return element;
}

function setAttributes(element, attributes) {
  let attrKeys = Object.keys(attributes);
  for(let i = 0; i < attrKeys.length; i++) {
    let attr = attrKeys[i];
    element.setAttribute(attr, attributes[attr]);
  }
}
