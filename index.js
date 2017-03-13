const { resolve }                  = require('path')
const { readFileSync, existsSync } = require('fs')

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const dotenv     = require('dotenv')
const projectDir = resolve('./')
const envFile    = resolve(`${projectDir}/.env.${process.env.NODE_ENV}`)

dotenv.config({ path: `${projectDir}/.env` })

if (existsSync(envFile)) {
  const envConfig = dotenv.parse(readFileSync(envFile))

  for (var k in envConfig) {
    process.env[k] = envConfig[k]
  }
}

require('babel-register')({
  presets: ['vue-app', 'es2015'],
  plugins: ['transform-runtime', 'add-module-exports'],
  only: /(vues\/lib\/.*.js|vues.config.js)$/
})

const server   = require('./lib/server')
const config   = require('./lib/config')
const template = require('./lib/template')
const utils    = require('./lib/utils')
const webpack  = require('./lib/webpack')

module.exports = { server, config, template, utils, webpack }
