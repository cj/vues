import chokidar from 'chokidar'
import {
  _,
  fs,
  objectToString,
  vuesTmpDir,
  vuesTmplDir,
  glob
} from './utils'

export const fileMethods = {
  routerJs: config => {
    const viewsDir = `${config.srcDir}/views`
    let routes = glob.sync('**/*.vue', { cwd: viewsDir })

    routes = routes.map(route => {
      const file = `${viewsDir}/${route}`
      const name = _.camelCase(route.replace('.vue', ''))

      let path = '/' + route.toLowerCase().replace('.vue', '')

      if (path === '/index') path = '/'

      return { file, name, path }
    })

    const router = objectToString(config.router)

    return { routes, router }
  }
}

export const fileOptions = (file, config) => {
  const fileMethod = _.camelCase(file)

  if (fileMethods[fileMethod]) {
    return fileMethods[fileMethod](config)
  } else {
    return {}
  }
}

export const createFile = (file, config) => {
  return new Promise((resolve, reject) => {
    // this hack is to stop webpack-dev-middleware rebuilding 20x at startup
    // https://github.com/webpack/webpack/issues/2983
    const time = new Date((new Date()).getTime() - 1000 * 60)

    fs.writeFileSync(
      vuesTmpDir(file),
      render(file, {...config, ...fileOptions(file, config)})
    )
    fs.utimesSync(vuesTmpDir(file), time, time)

    resolve(file)
  })
}

export const createFiles = config => {
  const files  = glob.sync('*.*', { cwd: vuesTmplDir() })
  const tmpDir = vuesTmpDir()

  // istanbul ignore next
  if (!fs.existsSync(tmpDir)) fs.mkdirsSync(tmpDir)

  const createdFiles = Promise.all(files.map(file => {
    return createFile(file, config)
  }))

  return createdFiles
}

export const updateFile = (path, config) => {
  if (path.includes(config.viewsDir)) createFile('router.js', config)
  if (path.includes(config.storeDir)) createFile('store.js', config)
}

export const updateAllFiles = async (config, webpackHotMiddleware) => {
  // istanbul ignore next
  if (fs.existsSync(config.vuesConfig)) {
    delete require.cache[config.vuesConfig]
    config = {...config, ...require(config.vuesConfig)}
  }

  await createFiles(config)

  webpackHotMiddleware.publish({ action: 'vuesConfigUpdated' })
}

export const watchFiles = (config, webpackHotMiddleware) => {
  const methods = [ 'add', 'addDir', 'unlink', 'unlinkDir' ]
  const watcher = chokidar.watch([
    config.viewsDir,
    config.storeDir
  ], { ignoreInitial: true })

  const configMethods = [...methods, 'change']
  const configWatcher = chokidar.watch([
    config.vuesConfig
  ], { ignoreInitial: true })

  watcher.on('ready', () => {
    methods.forEach(method => {
      watcher.on(method, path => {
        config.spinner.text = `${_.humanize(method)}: ${path.replace(config.storeDir + '/', '')}`
        config.spinner.start()
        updateFile(path, config)
      })
    })
  })

  configWatcher.on('ready', () => {
    configMethods.forEach(method => {
      configWatcher.on(method, async path => {
        config.spinner.text = `${_.humanize(method)}: vues.config.js`
        config.spinner.start()
        await updateAllFiles(config, webpackHotMiddleware)
      })
    })
  })
}

export const content = file => {
  return fs.readFileSync(vuesTmplDir(file))
}

export const render = (file, data) => {
  return _.template(content(file), { interpolate: /{{([\s\S]+?)}}/g })({...{_}, ...data})
}
