require('babel-register')({
  presets: ['vue-app', 'es2015'],
  plugins: ['transform-runtime'],
  only: /vues\/lib\/.*.js$/
})

const server = require('./lib/server').default
const config = require('./lib/config').default
const utils  = require('./lib/utils')

module.exports = { server, config, utils }
