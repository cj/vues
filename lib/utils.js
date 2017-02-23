import path        from 'path'
import lodash      from 'lodash'

export const glob = require('glob')
export const fs   = require('fs-extra')

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
  return path.resolve('./', ...args)
}

export const vuesDir = (...args) => {
  return path.resolve(__dirname, '../', ...args)
}

export const vuesTmpDir = (...args) => {
  return projectDir('node_modules', '.vues', ...args)
}

export const vuesTmplDir = (...args) => {
  return vuesDir('lib', 'templates', ...args)
}

export const objectToString = (obj, root = true, fromArray = false) => {
  let string = ''

  Object.entries(obj).forEach(([key, value]) => {
    key = JSON.stringify(key)

    if (isObject(value)) {
      string += `${key}: ${objectToString(value, false)}`
    } else {
      if (typeof value === 'function') {
        string += `${key}: ${value.toString()},\n`
      } else if (Array.isArray(value)) {
        let valuesString = ''
        const values = value.map(v => { return objectToString(v, false, true) })

        values.forEach(v => (valuesString += v))

        string += `${key}: [ ${valuesString} ],\n`
      } else {
        value = JSON.stringify(value)

        string += !fromArray ? `${key}: ${value},` : (
          isObject(obj) ? `${key}: ${value},` : `${value},`
        )
      }
    }
  })

  const endString = root ? '' : ','

  if (fromArray) {
    if (isObject(obj)) {
      return `{ ${string} }${endString}`
    } else if (Array.isArray(obj)) {
      return `[ ${string} ]${endString}`
    } else {
      return string
    }
  } else {
    return `{\n${string}\n}${endString}`
  }
}

export const _ = {
  ...lodash,
  humanize (str) {
    if (!str || str.length <= 2) {
      return str
    } else {
      return lodash.startCase(lodash.trim(lodash.snakeCase(str).replace(/_id$/, '').replace(/_/g, ' ')))
    }
  }
}
