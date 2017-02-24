const chokidar = jest.genMockFromModule('chokidar')

chokidar.__mockOn = jest.fn(async (eventName, callback) => {
  if (eventName === 'ready') {
    try {
      await callback()
    } catch (e) { }
  } else {
    try {
      await callback(chokidar.__mockPath, chokidar.__mockConfig)
    } catch (e) { }
  }
})

chokidar.watch = (files, options = {}) => {
  chokidar.__mockFiles = files

  return {
    on: chokidar.__mockOn
  }
}

export default chokidar
