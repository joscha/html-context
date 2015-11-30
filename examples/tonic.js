'use strict'; // eslint-disable-line
const jsdom = require('jsdom');
const htmlContext = require('html-context');

jsdom.env(
  `<html><div id="x"><h1>Hello world</h1></div></html>`,
  (err, window) => {
    if (err) {
      throw err;
    }
    const div = window.document.getElementById('x');
    /* eslint-disable no-console */
    console.log(htmlContext(div, {
      maxLength: 19,
    }));
  });
