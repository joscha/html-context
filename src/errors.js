'use strict'; // eslint-disable-line
const defineError = require('define-error');

module.exports.InvalidDOMElementError = defineError('InvalidDOMElementError', function InvalidDOMElementError(message, element) {
  this.element = element;
});
