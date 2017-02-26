import chokidar    from 'chokidar'
import { dirname } from 'path'
import {
  _,
  fs,
  objectToString,
  vuesTmpDir,
  vuesTmplDir,
  glob,
  isObject
} from './utils'

export const fileMethods = {
  routerJs: config => {
    const viewsDir = `${config.srcDir}/views`
    let routes = glob.sync('**/*.vue', { cwd: viewsDir })
    let router

    routes = routes.map(route => {
      const file          = `${viewsDir}/${route}`
      route               = route.replace(/\/index.vue$/, '.vue')
      const name          = _.kebabCase(route.replace('.vue', '')).replace('?', '')
      const componentName = _.capitalizeFirst(_.camelCase(`${name}View`))

      let path = '/' + route
        .toLowerCase()
        .replace('.vue', '')
        .replace('_', ':')

      if (path === '/index') path = '/'

      return { file, name, componentName, path }
    })

    if (isObject(config.router)) {
      router = objectToString(config.router)
    } else if (typeof config.router === 'function') {
      router = config.router.toString()
    } else {
      router = config.router
    }

    return { routes, router }
  },

  appVue: config => {
    const appHooks = [
      'beforeCreate',
      'created',
      'beforeMount',
      'mounted',
      'beforeUpdate',
      'updated',
      'activated',
      'deactivated',
      'destroyed'
    ]
    let hooks = []

    appHooks.forEach(hook => {
      const appHook = config[hook]

      if (appHook) {
        hooks.push({
          name: hook,
          callback: appHook.toString()
        })
      }
    })

    return { hooks }
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

export const createFile = (file, config, dir = vuesTmpDir(), path = '') => {
  const filePath     = `${dir}/${file}`
  const fileDirPath  = dirname(filePath)
  const tmplFilePath = `${path}${file}`

  return new Promise((resolve, reject) => {
    // this hack is to stop webpack-dev-middleware rebuilding 20x at startup
    // https://github.com/webpack/webpack/issues/2983
    const time = new Date((new Date()).getTime() - 1000 * 60)

    // istanbul ignore next
    if (!fs.existsSync(fileDirPath)) fs.mkdirsSync(fileDirPath)

    fs.writeFileSync(
      filePath,
      render(tmplFilePath, {...config, ...fileOptions(tmplFilePath, config)})
    )
    fs.utimesSync(filePath, time, time)

    resolve(file)
  })
}

export const createFiles = config => {
  const files  = glob.sync('*.*', { cwd: vuesTmplDir() })
  const tmpDir = vuesTmpDir()

  // istanbul ignore next
  if (fs.existsSync(tmpDir)) {
    fs.emptyDirSync(tmpDir)
  } else {
    fs.mkdirsSync(tmpDir)
  }

  const createdFiles = Promise.all(files.map(file => {
    return createFile(file, config)
  }))

  return createdFiles
}

export const createInitFiles = config => {
  const files  = glob.sync('**/*.*', { cwd: vuesTmplDir('init') })

  // istanbul ignore next
  if (!fs.existsSync(config.srcDir)) fs.mkdirsSync(config.srcDir)

  return Promise.all(files.map(file => {
    return createFile(file, config, config.srcDir, 'init/')
  }))
}

export const updateFile = (path, config) => {
  if (path.includes(config.viewsDir)) createFile('router.js', config)
  if (path.includes(config.storeDir)) createFile('store.js', config)
}

export const updateAllFiles = config => {
  // istanbul ignore next
  if (fs.existsSync(config.vuesConfig)) {
    delete require.cache[config.vuesConfig]
    config = {...config, ...require(config.vuesConfig)}
  }

  createFiles(config)
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
      watcher.on(method, async path => {
        config.spinner.text = `${_.humanize(method)}: ${path.replace(config.storeDir + '/', '')}`
        config.spinner.start()
        await updateFile(path, config)

        webpackHotMiddleware.publish({ action: 'vuesConfigUpdated' })
      })
    })
  })

  configWatcher.on('ready', () => {
    configMethods.forEach(method => {
      configWatcher.on(method, async path => {
        config.spinner.text = `${_.humanize(method)}: vues.config.js`
        config.spinner.start()
        await updateAllFiles(config)

        webpackHotMiddleware.publish({ action: 'vuesConfigUpdated' })
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
