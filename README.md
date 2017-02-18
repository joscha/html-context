# HTML Context

[![Greenkeeper badge](https://badges.greenkeeper.io/joscha/html-context.svg)](https://greenkeeper.io/)
[![Build status](https://img.shields.io/travis/joscha/html-context/master.svg)](https://travis-ci.org/joscha/html-context)
[![npm](https://img.shields.io/npm/v/html-context.svg)](https://www.npmjs.com/package/html-context)
[![npm](https://img.shields.io/npm/l/html-context.svg)](https://opensource.org/licenses/MIT)
[![David](https://img.shields.io/david/joscha/html-context.svg)](https://david-dm.org/joscha/html-context)
![node](https://img.shields.io/node/v/html-context.svg)
[![coveralls](https://img.shields.io/coveralls/joscha/html-context/master.svg)](https://coveralls.io/github/joscha/html-context)

This package allows you to generate some HTML context for a given DOM node. E.g.
Some markup looking like this:
```html
<html>
  <div id="x">
    <h1>Hello world</h1>
  </div>
</html>
```
with
```javascript
  const div = window.document.getElementById('x');
  htmlContext(div, {
    maxLength: 19,
  });
```
would result in
```
<div id="x">…</div>
```

The context can either be `document` or an `HTMLElement`.

## Install
```console
npm install html-context --save
```
or in the browser (UMD):
```html
<script src="html-context/dist/index.js"></script>
```

## Options
`options.maxLength`: the maximum length of the returned context. The package will try and fit the outermost tag in if it can. Defaults to no maximum length.

`options.beautify`: Beautifies the returned context snippet. Defaults to `false`.

`options.placeholder`: The placeholder to use for capped markup. Defaults to `…`.
