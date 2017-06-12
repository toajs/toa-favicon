'use strict'
// **Github:** https://github.com/toajs/toa-favicon
//
// **License:** MIT

const fs = require('fs')
const Toa = require('toa')
const path = require('path')
const tman = require('tman')
const crypto = require('crypto')
const assert = require('assert')
const request = require('supertest')
const favicon = require('../index')

tman.suite('favicon()', function () {
  const icoPath = path.join(__dirname, 'fixtures', 'favicon.ico')

  tman.it('should only respond on /favicon.ico', function () {
    const app = new Toa()

    app.use(favicon('test/fixtures'))
    app.use(function () {
      assert(this.body == null)
      assert.strictEqual(this.get('Content-Type'), '')
      this.body = 'hello'
    })

    return request(app.listen())
      .get('/')
      .expect('hello')
  })

  tman.it('should not enter rest process on /favicon.ico', function () {
    const app = new Toa()

    app.use(favicon('test/fixtures'))
    app.use(function () {
      assert.strictEqual('It should not run!', true)
    })

    return request(app.listen())
      .get('/favicon.ico')
      .expect(200)
      .expect('content-type', 'image/x-icon')
      .expect('cache-control', 'max-age=864000')
  })

  tman.it('should not accept POST requests', function () {
    const app = new Toa()
    app.use(favicon(icoPath))

    return request(app.listen())
      .post('/favicon.ico')
      .expect('allow', 'GET, HEAD, OPTIONS')
      .expect(405)
  })

  tman.it('should send the favicon', function () {
    const body = fs.readFileSync(icoPath)
    const app = new Toa()
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
    const lastModified = fs.statSync(icoPath).mtime.toUTCString()
    const md5 = crypto.createHash('md5').update(fs.readFileSync(icoPath)).digest('base64')
    const app = new Toa()
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
    const app = new Toa()
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
    const app = new Toa()
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
