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

  tman.it('should only respond on /favicon.ico', function (done) {
    var app = Toa(function () {
      assert(this.body == null)
      assert.strictEqual(this.get('Content-Type'), '')
      this.body = 'hello'
    })

    app.use(favicon('test/fixtures'))

    request(app.listen())
      .get('/')
      .expect('hello', done)
  })

  tman.it('should not enter rest process on /favicon.ico', function (done) {
    var app = Toa(function () {
      assert.strictEqual('It should not run!', true)
    })

    app.use(favicon('test/fixtures'))

    request(app.listen())
      .get('/favicon.ico')
      .expect(200)
      .expect('Content-Type', 'image/x-icon')
      .expect('Cache-Control', 'max-age=864000')
      .end(done)
  })

  tman.it('should not accept POST requests', function (done) {
    var app = Toa()
    app.use(favicon(icoPath))

    request(app.listen())
      .post('/favicon.ico')
      .expect('Allow', 'GET, HEAD, OPTIONS')
      .expect(405, done)
  })

  tman.it('should send the favicon', function (done) {
    var body = fs.readFileSync(icoPath)
    var app = Toa()
    app.use(favicon('test/fixtures'))

    request(app.listen())
      .get('/favicon.ico')
      .expect(200)
      .expect('Content-Type', 'image/x-icon')
      .expect('Cache-Control', 'max-age=864000')
      .expect(function (res) {
        assert(body.toString() === res.body.toString())
      })
      .end(done)
  })

  tman.it('should respond with 304', function (done) {
    var lastModified = fs.statSync(icoPath).mtime.toUTCString()
    var md5 = crypto.createHash('md5').update(fs.readFileSync(icoPath)).digest('base64')
    var app = Toa()
    app.use(favicon('test/fixtures'))

    request(app.listen())
      .get('/favicon.ico')
      .set('If-Modified-Since', lastModified)
      .set('If-None-Match', '"' + md5 + '"')
      .expect(304)
      .expect('ETag', '"' + md5 + '"')
      .expect('Last-Modified', lastModified)
      .end(done)
  })

  tman.it('should set max-age', function (done) {
    var app = Toa()
    app.use(favicon({
      path: icoPath,
      maxAge: 5000
    }))
    request(app.listen())
      .get('/favicon.ico')
      .expect('Cache-Control', 'max-age=5')
      .expect(200, done)
  })

  tman.it('should accept 0', function (done) {
    var app = Toa()
    app.use(favicon({
      path: icoPath,
      maxAge: 0
    }))
    request(app.listen())
      .get('/favicon.ico')
      .expect('Cache-Control', 'max-age=0')
      .expect(200, done)
  })
})
