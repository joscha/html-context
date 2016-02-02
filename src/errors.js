'use strict'; // eslint-disable-line
const defineError = require('define-error');

function InvalidDOMElementError(message, element) {
  this.element = element;
}

module.exports.InvalidDOMElementError = defineError(
  'InvalidDOMElementError',
  InvalidDOMElementError
);
