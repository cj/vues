import vueLoaders                          from './vue-loaders'
import webpack                             from 'webpack'
import HtmlWebpackPlugin                   from 'html-webpack-plugin'
import { projectDir, vuesDir, vuesTmpDir } from '../utils'

const CircularDependencyPlugin = require('circular-dependency-plugin')

export default config => {
  let staticDirName

  config.postcssOptions = [
    require('autoprefixer')({
      browsers: ['ie > 8', 'last 4 versions']
    })
  ]

  if (config.nodeEnv === 'production') {
    staticDirName = `${config.staticDir}/[name].[chunkhash:8].[ext]`
  } else {
    staticDirName = `${config.staticDir}/[name].[ext]`
  }

  return {
    // Webpack can target multiple environments such as `node`,
    // `browser`, and even `electron`. Since Backpack is focused on Node,
    // we set the default target accordingly.
    target: 'web',

    // Some libraries import Node modules but don't use them in the browser.
    // Tell Webpack to provide empty mocks for them so importing them works.
    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty'
    },

    performance: {
      hints: false
    },

    output: {
      filename: '[name].js',
      sourceMapFilename: '[name].map',
      publicPath: '/'
    },

    devtool: 'eval-source-map',

    resolve: {
      extensions: ['.js', '.vue', '.html', '.css', '.json', '.scss', '.sass', '.less', '.styl'],
      alias: {
        '~': config.srcDir,
        'vues': config.vuesTmpDir
      },
      modules: [
        projectDir('node_modules'),
        vuesDir('node_modules'),
        config.srcDir
      ]
    },

    resolveLoader: {
      modules: [
        projectDir('node_modules'),
        vuesDir('node_modules')
      ]
    },

    entry: {
      client: [vuesTmpDir('client.js')],
      vendor: [...config.vendor, ...config.polyfills.map(polyfill => {
        return 'core-js/fn/' + polyfill
      })]
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          use: [{
            loader: 'babel-loader',
            query: config.babel
          }],
          include (filepath) {
            // for anything outside node_modules
            if (!filepath.includes('node_modules/')) {
              return true
            }

            // specific modules that need to be transpiled by babel
            for (const name of config.include) {
              if (filepath.includes(name)) {
                return true
              }
            }

            return false
          }
        },
        {
          test: /\.vue$/,
          use: [{
            loader: 'vue-loader',
            options: vueLoaders(config)
          }]
        },
        {
          test: /\.css$/,
          use: [
            { loader: 'style-loader' },
            { loader: 'css-loader' },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => {
                  return config.postcssOptions
                }
              }
            }
          ]
        },
        {
          test: /\.json$/,
          use: 'json-loader'
        },
        {
          test: /\.(ico|jpg|png|gif|eot|otf|webp|ttf|woff|woff2)(\?.*)?$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: staticDirName
            }
          }]
        },
        {
          test: /\.(svg)(\?.*)?$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: staticDirName
            }
          }]
        }
      ]
    },

    plugins: [
      new CircularDependencyPlugin({
        // add errors to webpack instead of warnings
        failOnError: true
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: module => {
          return module.resource && /\.(js|css|styl|less|sass|jsx)$/.test(module.resource) && module.resource.indexOf('node_modules') !== -1
        }
      }),
      // new webpack.optimize.CommonsChunkPlugin({
      //   name: 'manifest'
      // }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        hash: false,
        template: vuesTmpDir('index.html'),
        inject: true,
        chunksSortMode: 'dependency'
      })
    ]
  }
}
