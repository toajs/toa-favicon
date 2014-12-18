'use strict';
// **Github:** https://github.com/toajs/toa-favicon
//
// **License:** MIT

var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var Thunk = require('thunks')();

var stat = Thunk.thunkify(fs.stat);
var readFile = Thunk.thunkify(fs.readFile);

module.exports = function toaFavicon(options) {
  options = options || {};
  if (typeof options === 'string') options = {path: options};

  var maxAge = options.maxAge >= 0 ? Math.ceil(options.maxAge / 1000) : 864000;
  var icoPath = path.resolve(process.cwd(), options.path || '');
  if (!path.extname(icoPath)) icoPath = path.join(icoPath, 'favicon.ico');
  var icoObj = {};

  var thunk = stat(icoPath)(function (err, stats) {
    if (err) throw err;
    icoObj.lastModified = stats.mtime.toUTCString();
    return readFile(icoPath);
  })(function (err, buf) {
    if (err) throw err;
    icoObj.content = buf;
    icoObj.md5 = crypto.createHash('md5').update(buf).digest('base64');
  });


  return function favicon(callback) {
    return Thunk.call(this)(function() {
      if (icoObj.content) return;
      return thunk;
    })(function (err) {
      if (err) throw err;
      if (this.path !== '/favicon.ico') return;

      var method = this.method;
      if (method !== 'GET' && method !== 'HEAD') {
        this.status = method === 'OPTIONS' ? 200 : 405;
        this.set('Allow', 'GET, HEAD, OPTIONS');
        return;
      }

      this.status = 200;
      this.lastModified = icoObj.lastModified;
      this.etag = icoObj.md5;
      if (this.fresh) {
        this.status = 304;
        return;
      }

      this.set('Cache-Control', 'max-age=' + maxAge);
      this.type = 'image/x-icon';
      this.body = icoObj.content;
    })(callback);
  };
};
