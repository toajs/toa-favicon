'use strict'
// **Github:** https://github.com/toajs/toa-favicon
//
// **License:** MIT

const Toa = require('toa')
const toaFavicon = require('../index')

const app = new Toa()
app.use(function () {
  this.body = 'Hi, toa-favicon!'
})

app.use(toaFavicon('examples/favicon.ico'))
app.listen(3000)
