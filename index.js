'use strict';
// **Github:** https://github.com/toajs/toa-favicon
//
// **License:** MIT

var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

module.exports = function toaFavicon(options) {
  options = options || {};
  if (typeof options === 'string') options = {path: options};

  var maxAge = options.maxAge >= 0 ? Math.ceil(options.maxAge / 1000) : 864000;
  var icoPath = path.resolve(process.cwd(), options.path || '');
  if (!path.extname(icoPath)) icoPath = path.join(icoPath, 'favicon.ico');

  var stats = fs.statSync(icoPath);
  var file = fs.readFileSync(icoPath);

  var icoObj = {
    content: file,
    lastModified: stats.mtime.toUTCString(),
    md5: crypto.createHash('md5').update(file).digest('base64')
  };

  return function favicon(callback) {
    if (this.path !== '/favicon.ico') return callback();

    var method = this.method;
    if (method !== 'GET' && method !== 'HEAD') {
      this.status = method === 'OPTIONS' ? 200 : 405;
      this.set('Allow', 'GET, HEAD, OPTIONS');
      return callback();
    }

    this.status = 200;
    this.lastModified = icoObj.lastModified;
    this.etag = icoObj.md5;
    if (this.fresh) {
      this.status = 304;
      return callback();
    }

    this.set('Cache-Control', 'max-age=' + maxAge);
    this.type = 'image/x-icon';
    this.body = icoObj.content;
    callback();
  };
};
