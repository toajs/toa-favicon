'use strict'
// **Github:** https://github.com/toajs/toa-favicon
//
// **License:** MIT

var fs = require('fs')
var Toa = require('toa')
var path = require('path')
var tman = require('tman')
var crypto = require('crypto')
var assert = require('assert')
var request = require('supertest')
var favicon = require('../index')

tman.suite('favicon()', function () {
  var icoPath = path.join(__dirname, 'fixtures', 'favicon.ico')

  tman.it('should only respond on /favicon.ico', function () {
    var app = Toa(function () {
      assert(this.body == null)
      assert.strictEqual(this.get('Content-Type'), '')
      this.body = 'hello'
    })

    app.use(favicon('test/fixtures'))

    return request(app.listen())
      .get('/')
      .expect('hello')
  })

  tman.it('should not enter rest process on /favicon.ico', function () {
    var app = Toa(function () {
      assert.strictEqual('It should not run!', true)
    })

    app.use(favicon('test/fixtures'))

    return request(app.listen())
      .get('/favicon.ico')
      .expect(200)
      .expect('content-type', 'image/x-icon')
      .expect('cache-control', 'max-age=864000')
  })

  tman.it('should not accept POST requests', function () {
    var app = Toa()
    app.use(favicon(icoPath))

    return request(app.listen())
      .post('/favicon.ico')
      .expect('allow', 'GET, HEAD, OPTIONS')
      .expect(405)
  })

  tman.it('should send the favicon', function () {
    var body = fs.readFileSync(icoPath)
    var app = Toa()
    app.use(favicon('test/fixtures'))

    return request(app.listen())
      .get('/favicon.ico')
      .expect(200)
      .expect('content-type', 'image/x-icon')
      .expect('cache-control', 'max-age=864000')
      .expect(function (res) {
        assert(body.toString() === res.body.toString())
      })
  })

  tman.it('should respond with 304', function () {
    var lastModified = fs.statSync(icoPath).mtime.toUTCString()
    var md5 = crypto.createHash('md5').update(fs.readFileSync(icoPath)).digest('base64')
    var app = Toa()
    app.use(favicon('test/fixtures'))

    return request(app.listen())
      .get('/favicon.ico')
      .set('if-modified-since', lastModified)
      .set('if-none-match', '"' + md5 + '"')
      .expect(304)
      .expect('etag', '"' + md5 + '"')
      .expect('last-modified', lastModified)
  })

  tman.it('should set max-age', function () {
    var app = Toa()
    app.use(favicon({
      path: icoPath,
      maxAge: 5000
    }))

    return request(app.listen())
      .get('/favicon.ico')
      .expect('cache-control', 'max-age=5')
      .expect(200)
  })

  tman.it('should accept 0', function () {
    var app = Toa()
    app.use(favicon({
      path: icoPath,
      maxAge: 0
    }))

    return request(app.listen())
      .get('/favicon.ico')
      .expect('cache-control', 'max-age=0')
      .expect(200)
  })
})
