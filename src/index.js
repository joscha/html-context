'use strict'; // eslint-disable-line
const beautify = require('js-beautify').html_beautify;
const objectAssign = require('object-assign');
const errors = require('./errors');

/**
* Gets the window object from a given element or document
*
* @private
* @param {!HTMLDocument|HTMLElement} element The element to get the window object for
* @return {Window|null} the window object for the given element
*/
function getWindowForElement(element) {
  const e = element.documentElement || element;
  const doc = e.ownerDocument;
  return doc.defaultView;
}

const PLACEHOLDER = '…';

const DEFAULT_OPTIONS = {
  beautify: false,
  maxLength: 0,
  placeholder: PLACEHOLDER,
};

/**
* Checks whether this is a valid element for providing context
*
* @private
* @param {!HTMLDocument|HTMLElement} element The element to check for validity
* @return {boolean} Whether this is a valid element to provide context for
*/
function isValidElement(element) {
  return element && (element.documentElement /* document */ || element.ownerDocument /* any other element */);
}

module.exports = (e, opts) => {
  if (!isValidElement(e)) {
    throw new errors.InvalidDOMElementError(`Element is not a valid DOM element`, e);
  }

  const options = objectAssign({}, DEFAULT_OPTIONS, opts || {});
  options.placeholder = '' + options.placeholder;

  let element = e;
  const window = getWindowForElement(e);
  if (e instanceof window.HTMLDocument) {
    element = e.documentElement;
  }

  if (!element.outerHTML) {
    // SVG elements for example
    return null;
  }

  const outer = options.beautify ? beautify(element.outerHTML) : element.outerHTML;
  const outerLength = outer.length;
  const fitsComplete = options.maxLength - outerLength >= 0;
  if (options.maxLength && options.maxLength > 0 && !fitsComplete) {
    // we only have space for shortened markup
    let remainingChars = options.maxLength;

    const inner = options.beautify ? beautify(element.innerHTML) : element.innerHTML;
    const outerTagWithoutInner = outer.replace(inner, options.placeholder);

    let leftBoundary = 0;
    let rightBoundary = 0;
    if (outerTagWithoutInner.length <= options.maxLength && outer.indexOf(inner) !== -1) {
      // can we fit the whole outermost tag in whole? If yes, then let's do so...
      const outerPieces = outer.split(inner);
      leftBoundary = outerPieces.shift().length;
      rightBoundary = -outerPieces.pop().length;
      // subtract the space we need for opening and closing outer tag
      remainingChars -= leftBoundary + Math.abs(rightBoundary);
    }
    // we need X chars for the placeholder
    remainingChars -= options.placeholder.length;

    const remainingCharsLeft = Math.ceil(remainingChars / 2); // in case of uneven split, favor beginning with 1 character
    const remainingCharsRight = remainingChars - remainingCharsLeft;
    leftBoundary += remainingCharsLeft;
    rightBoundary -= remainingCharsRight;
    return outer.substring(0, leftBoundary) + options.placeholder + outer.substr(rightBoundary);
  }
  // we have enough space for all markup
  return outer;
};
