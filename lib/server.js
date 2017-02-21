import micro   from 'micro'
import webpack from 'webpack'
import url     from 'url'

import vuesWebpack     from './webpack'
import { createFiles } from './template'

export default config => {
  createFiles(config)

  const webpackConfig   = vuesWebpack(config)
  const webpackHotPath  = `${webpackConfig.output.publicPath}/__webpack_hmr`
  const webpackCompiler = webpack(webpackConfig)

  let webpackHotMiddleware = false

  const webpackDevMiddleware = require('webpack-dev-middleware')(webpackCompiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
    quiet: true,
    lazy: config.nodeEnv === 'test'
  })

  // istanbul ignore next
  if (config.nodeEnv === 'development') {
    webpackHotMiddleware = require('webpack-hot-middleware')(webpackCompiler, {
      log: () => {}, path: webpackHotPath
    })
  }

  const next = (req, res) => {
    webpackDevMiddleware(req, res, () => {
      // if the file doesn't exist in webpack, load index.html
      req.url = '/'
      // istanbul ignore next
      webpackDevMiddleware(req, res, () => {})
    })
  }

  const server = (req, res) => {
    res.status = 200

    let { path } = url.parse(req.url)

    switch (path) {
      /* istanbul ignore next */
      case webpackHotPath:
        return webpackHotMiddleware(req, res, next)
      default:
        return next(req, res)
    }
  }

  return micro(server)
}
