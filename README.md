toa-favicon v1.0.0 [![Build Status](https://travis-ci.org/toajs/toa-favicon.svg)](https://travis-ci.org/toajs/toa-favicon)
====
Favicon middleware for toa.

## [toa](https://github.com/toajs/toa)

## Demo

**use as middleware:**
```js
'use strict';
var Toa = require('toa');
var favicon = require('toa-favicon');

var app = Toa(function (Thunk) {
  if (!this.body) this.body = 'Hi, toa-favicon!';
});

app.use(favicon('static/favicon.ico'));
app.listen(3000);
```

**use as module**
```js
var Toa = require('toa');
var favicon = require('../index')('examples');

var app = Toa(function (Thunk) {
  if (this.path === '/favicon.ico') return Thunk.call(this, favicon);
  this.body = 'Hi, toa-favicon!';
});

app.listen(3000);
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
- `options.maxAge` (Number) - Cache control max age (ms) for the files, default to `24 * 60 * 60 * 1000`.

`favicon('static')` is equal to `favicon({path: 'static'})`.

`favicon('static')` is equal to `favicon('static/favicon.ico')`.

`favicon('static')` is equal to `favicon('process.cwd()/static/favicon.ico')`.


## License

The MIT License (MIT)
