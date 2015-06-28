'use strict'
// **Github:** https://github.com/toajs/toa-favicon
//
// **License:** MIT

var Toa = require('toa')
var toaFavicon = require('../index')

var app = Toa(function () {
  this.body = 'Hi, toa-favicon!'
})

app.use(toaFavicon('examples/favicon.ico'))
app.listen(3000)
