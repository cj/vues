require('babel-register')({
  presets: ['vue-app', 'es2015'],
  plugins: ['add-module-exports'],
  only: /vues\/lib\/.*.js$/
})

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const server = require('./lib/server')
const config = require('./lib/config')
const utils  = require('./lib/utils')

module.exports = { server, config, utils }
