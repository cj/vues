import webpackMerge      from 'webpack-merge'
import webpackBaseConfig from './base.config'

export default config => {
  let webpackConfig = webpackBaseConfig(config)

  if (['production', 'development', 'test'].includes(config.nodeEnv)) {
    webpackConfig = webpackMerge.smart(webpackConfig,
      require(`./${config.nodeEnv}.config`)(config)
    )
  }

  // merge vues.config.js webpack if present
  if (typeof config.webpack === 'function') {
    webpackConfig = config.webpack(webpackConfig)
  } else if (typeof config.webpack === 'object') {
    webpackConfig = webpackMerge.smart(webpackConfig, config.webpack)
  }

  return webpackConfig
}
