'use strict'
// **Github:** https://github.com/toajs/toa-favicon
//
// **License:** MIT

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

module.exports = function toaFavicon (options) {
  options = options || {}
  if (typeof options === 'string') options = {path: options}

  const maxAge = options.maxAge >= 0 ? Math.ceil(options.maxAge / 1000) : 864000
  var icoPath = path.resolve(process.cwd(), options.path || '')
  if (!path.extname(icoPath)) icoPath = path.join(icoPath, 'favicon.ico')

  const stats = fs.statSync(icoPath)
  const file = fs.readFileSync(icoPath)

  const icoObj = {
    content: file,
    lastModified: stats.mtime.toUTCString(),
    md5: crypto.createHash('md5').update(file).digest('base64')
  }

  return function favicon () {
    if (this.path !== '/favicon.ico') return

    let method = this.method
    if (method !== 'GET' && method !== 'HEAD') {
      this.status = method === 'OPTIONS' ? 200 : 405
      this.set('allow', 'GET, HEAD, OPTIONS')
      return this.end()
    }

    this.status = 200
    this.lastModified = icoObj.lastModified
    this.etag = icoObj.md5
    if (this.fresh) {
      this.status = 304
      return this.end()
    }

    this.set('cache-control', 'max-age=' + maxAge)
    this.type = 'image/x-icon'
    this.body = icoObj.content
    this.end()
  }
}
