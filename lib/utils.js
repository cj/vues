import { resolve } from 'path'
import fs          from 'fs'

export const isObject = item => {
  return !!(item && typeof item === 'object' && !Array.isArray(item) && item !== null)
}

export const deepMerge = (target, source) => {
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

export const projectDir = (...args) => {
  return resolve('./', ...args)
}

export const vuesDir = (...args) => {
  return resolve(__dirname, '../', ...args)
}

export const vuesTmpDir = (...args) => {
  return projectDir('node_modules', '.vues', ...args)
}

export const writeFileSync = (file, content) => {
  return fs.writeFileSync(file, content, 'utf8')
}

export const existsSync = file => {
  return fs.existsSync(file)
}

export const unlinkSync = file => {
  return fs.unlinkSync(file)
}
