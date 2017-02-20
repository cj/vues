import { resolve } from 'path'

const utils = require.requireActual('../utils')

const projectDir = (...args) => {
  return resolve(__dirname, '../../example', ...args)
}

const vuesTmpDir = (...args) => {
  return projectDir('node_modules', '.vues', ...args)
}

export default {
  ...utils,
  projectDir,
  vuesTmpDir
}
