'use strict'
// **Github:** https://github.com/toajs/toa-favicon
//
// **License:** MIT

const Toa = require('toa')
const favicon = require('../index')('examples')

const app = new Toa()
app.use(function * () {
  yield favicon
  this.body = 'Hi, toa-favicon!'
})

app.listen(3000)
