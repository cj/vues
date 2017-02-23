require('babel-register')({
  presets: ['vue-app', 'es2015'],
  plugins: ['transform-runtime', 'add-module-exports'],
  only: /(vues\/lib\/.*.js|vues.config.js)$/
})

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const server = require('./lib/server')
const config = require('./lib/config')
const utils  = require('./lib/utils')

module.exports = { server, config, utils }
