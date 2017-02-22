import ExtractTextPlugin from 'extract-text-webpack-plugin'
import queryString       from 'query-string'

export default config => {
  let vueLoaderConfig = { postcss: config.postcssOptions }
  let babelOptions    = queryString.stringify(config.babel, { arrayFormat: 'bracket' })

  if (config.nodeEnv === 'development') {
    vueLoaderConfig = {
      ...vueLoaderConfig,
      loaders: {
        js:     `babel-loader?${babelOptions}`,
        css:   'vue-style-loader!css-loader',
        less:   'vue-style-loader!css-loader!less-loader',
        sass:   'vue-style-loader!css-loader!sass-loader?indentedSyntax',
        scss:   'vue-style-loader!css-loader!sass-loader',
        stylus: 'vue-style-loader!css-loader!stylus-loader',
        styl:   'vue-style-loader!css-loader!stylus-loader'
      }
    }
  } else {
    vueLoaderConfig = {
      ...vueLoaderConfig,
      loaders: {
        js: `babel-loader?${babelOptions}`,
        css: ExtractTextPlugin.extract({ use: 'css-loader', fallback: 'vue-style-loader' }),
        less: ExtractTextPlugin.extract({ use: 'css-loader!less-loader', fallback: 'vue-style-loader' }),
        scss: ExtractTextPlugin.extract({ use: 'css-loader!sass-loader', fallback: 'vue-style-loader' }),
        sass: ExtractTextPlugin.extract({ use: 'css-loader!sass-loader?indentedSyntax', fallback: 'vue-style-loader' }),
        stylus: ExtractTextPlugin.extract({ use: 'css-loader!stylus-loader', fallback: 'vue-style-loader' }),
        styl: ExtractTextPlugin.extract({ use: 'css-loader!stylus-loader', fallback: 'vue-style-loader' })
      }
    }
  }

  return vueLoaderConfig
}
