'use strict'
// **Github:** https://github.com/toajs/toa-favicon
//
// **License:** MIT

var Toa = require('toa')
var favicon = require('../index')('examples')

var app = Toa(function *() {
  yield favicon
  this.body = 'Hi, toa-favicon!'
})

app.listen(3000)
