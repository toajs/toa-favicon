toa-favicon
====
Favicon middleware for toa.

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]

## [toa](https://github.com/toajs/toa)

## Demo

**use as middleware:**
```js
var Toa = require('toa')
var favicon = require('toa-favicon')

var app = Toa(function () {
  this.body = 'Hi, toa-favicon!'
});

app.use(favicon('static/favicon.ico'))
app.listen(3000)
```

**use as module**
```js
var Toa = require('toa')
var favicon = require('toa-favicon')('examples')

var app = Toa(function *() {
  yield favicon
  this.body = 'Hi, toa-favicon!'
})

app.listen(3000)
```

## Installation

```bash
npm install toa-favicon
```

## API

```js
var favicon = require('toa-favicon');
```

### favicon([options])

Return a thunk function.

- `options.path` (String) - The directory you wish to serve, default to `process.cwd()`.
- `options.maxAge` (Number) - Cache control max age (ms) for the files, default to `10 * 24 * 60 * 60 * 1000`.

`favicon('static')` is equal to `favicon({path: 'static'})`.

`favicon('static')` is equal to `favicon('static/favicon.ico')`.

`favicon('static')` is equal to `favicon('process.cwd()/static/favicon.ico')`.


## License

The MIT License (MIT)

[npm-url]: https://npmjs.org/package/toa-favicon
[npm-image]: http://img.shields.io/npm/v/toa-favicon.svg

[travis-url]: https://travis-ci.org/toajs/toa-favicon
[travis-image]: http://img.shields.io/travis/toajs/toa-favicon.svg
