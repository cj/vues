import webpackMerge      from 'webpack-merge'
import webpackBaseConfig from './base.config'
import stats             from './stats'

export { stats }

export default config => {
  const smartOptions = { 'module.rules.use': 'replace' }
  let webpackConfig = webpackBaseConfig(config)

  if (['production', 'development', 'test'].includes(config.nodeEnv)) {
    webpackConfig = webpackMerge.smartStrategy(smartOptions)(webpackConfig,
      require(`./${config.nodeEnv}.config`)(config)
    )
  }

  // merge vues.config.js webpack if present
  if (typeof config.webpack === 'function') {
    webpackConfig = config.webpack(webpackConfig)
  } else if (typeof config.webpack === 'object') {
    webpackConfig = webpackMerge.smartStrategy(smartOptions)(
      webpackConfig, config.webpack
    )
  }

  return webpackConfig
}
