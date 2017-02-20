import { resolve } from 'path'
import fs          from 'fs'

export const isObject = function (item) {
  return !!(item && typeof item === 'object' && !Array.isArray(item) && item !== null)
}

export const deepMerge = function (target, source) {
  let obj = {...target} // clones target

  Object.keys(source).forEach(key => {
    const sourceValue = source[key]

    if (Array.isArray(sourceValue)) {
      obj[key] = [...(obj[key] || []), ...sourceValue] // clone merge array
    } else if (isObject(sourceValue)) {
      obj[key] = deepMerge(obj[key] || {}, sourceValue)
    } else {
      obj[key] = sourceValue
    }
  })

  return obj
}

export const projectDir = function (...args) {
  return resolve('./', ...args)
}

export const vuesDir = function (...args) {
  return resolve(__dirname, '../', ...args)
}

export const vuesTmpDir = function (...args) {
  return projectDir('node_modules', '.vues', ...args)
}

export const writeFileSync = function (file, content) {
  return fs.writeFileSync(file, content, 'utf8')
}

export const existsSync = function (file) {
  return fs.existsSync(file)
}

export const unlinkSync = function (file) {
  return fs.unlinkSync(file)
}
