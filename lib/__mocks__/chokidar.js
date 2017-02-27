const chokidar = jest.genMockFromModule('chokidar')

chokidar.__mockPromises = []

chokidar.__mockOn = (eventName, callback) => {
  if (eventName === 'ready') {
    callback()
  } else if (eventName === chokidar.__mockEventName) {
    chokidar.__mockPromises.push(callback(chokidar.__mockPath, chokidar.__mockConfig))
  }
}

chokidar.watch = (files, options = {}) => {
  chokidar.__mockFiles = files

  return {
    on: chokidar.__mockOn
  }
}

export default chokidar
