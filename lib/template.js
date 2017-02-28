import chokidar    from 'chokidar'
import { dirname } from 'path'
import {
  _,
  fs,
  deepMerge,
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

    const files = glob.sync('**/*.*', { cwd: config.layoutsDir })
    const layouts = files.reduce((newFiles, file) => {
      let name = _.camelCase(file.replace('.vue', 'Layout'))
      let path = `${config.layoutsDir}/${file}`

      return [...newFiles, { name, path }]
    }, [])

    return { hooks, layouts }
  },

  filtersJs: config => {
    const files = glob.sync('**/*.*', { cwd: config.filtersDir })
    let filters = {}

    files.forEach(file => {
      let name = _.camelCase(file.replace('.js', ''))

      filters[name] = `${config.filtersDir}/${file}`
    })

    filters = Object.entries(deepMerge(filters, config.filters))

    return { filters }
  },

  storeJs: config => {
    let stores  = []
    let storeConfig
    const files = glob.sync('**/*.*', { cwd: config.storesDir })

    files.forEach(file => {
      let name          = _.camelCase(file.replace('.js', ''))
      let componentName = name + 'Store'
      let path          = `${config.storesDir}/${file}`

      stores.push({ name, componentName, path })
    })

    if (isObject(config.store)) {
      storeConfig = objectToString(config.store)
    } else if (typeof config.store === 'function') {
      storeConfig = config.store.toString()
    } else {
      storeConfig = config.store
    }

    return { stores, storeConfig }
  },

  indexJs: async config => {
    const folders = [
      config.storesDir,
      config.filtersDir
    ]

    const folderResults = await Promise.all(folders.map(folder => {
      return new Promise(resolve => {
        const name = _.camelCase(folder.replace(config.srcDir + '/', 'has '))
        return resolve({ [name]: fs.existsSync(folder) })
      })
    }))

    return folderResults.reduce((obj, folder) => {
      return {...obj, ...folder}
    }, {})
  }
}

export const fileConfigs = (file, config) => {
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

  return new Promise(async (resolve, reject) => {
    // this hack is to stop webpack-dev-middleware rebuilding 20x at startup
    // https://github.com/webpack/webpack/issues/2983
    const time = new Date((new Date()).getTime() - 1000 * 60)

    // istanbul ignore next
    if (!fs.existsSync(fileDirPath)) fs.mkdirsSync(fileDirPath)

    const fileConfig = await fileConfigs(tmplFilePath, config)

    fs.writeFileSync(
      filePath,
      render(tmplFilePath, {...config, ...fileConfig})
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

  return Promise.all(files.map(file => {
    return createFile(file, config)
  }))
}

export const createInitFiles = config => {
  const files  = glob.sync('**/*.*', { cwd: vuesTmplDir('init') })

  // istanbul ignore next
  if (!fs.existsSync(config.srcDir)) fs.mkdirsSync(config.srcDir)

  return Promise.all(files.map(file => {
    return createFile(file, config, config.srcDir, 'init/')
  }))
}

export const dirFileName = (path, config) => {
  switch (true) {
    case path.includes(config.viewsDir):
      return 'router.js'
    case path.includes(config.storesDir):
      return 'store.js'
    case path.includes(config.filtersDir):
      return 'filters.js'
    case path.includes(config.layoutsDir):
      return 'app.vue'
    default:
      throw new Error(`${path} doesn't have a dirFileName`)
  }
}

export const updateFile = (path, config) => {
  return createFile(dirFileName(path, config), config)
}

export const updateAllFiles = config => {
  // istanbul ignore next
  if (fs.existsSync(config.vuesConfig)) {
    delete require.cache[config.vuesConfig]
    config = {...config, ...require(config.vuesConfig)}
  }

  return createFiles(config)
}

export const watchFiles = (config, webpackHotMiddleware) => {
  const methods = [ 'add', 'addDir', 'unlink', 'unlinkDir' ]
  const watcher = chokidar.watch([
    config.viewsDir,
    config.storesDir,
    config.filtersDir,
    config.layoutsDir
  ], { ignoreInitial: true })

  const configMethods = [...methods, 'change']
  const configWatcher = chokidar.watch([
    config.vuesConfig
  ], { ignoreInitial: true })

  watcher.on('ready', () => {
    methods.forEach(method => {
      watcher.on(method, async path => {
        config.spinner.text = `${_.humanize(method)}: ${path.replace(config.storesDir + '/', '')}`
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
