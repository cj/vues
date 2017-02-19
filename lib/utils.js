export const isObject = (item) => {
  return (item && typeof item === 'object' && !Array.isArray(item) && item !== null)
}

export const deepMerge = (target, source) => {
  let obj = {...target} // clones target

  if (isObject(target) && isObject(source)) {
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
  }

  return obj
}
