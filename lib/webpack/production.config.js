import ExtractTextPlugin       from 'extract-text-webpack-plugin'
import ClosureCompilerPlugin   from 'webpack-closure-compiler'
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import { cpus }                from 'os'

export default config => {
  return {
    devtool: 'source-map',

    output: {
      filename: '[name].[chunkhash:8].js',
      sourceMapFilename: '[name].[chunkhash:8].map',
      path: config.buildDir
    },

    module: {
      rules: [
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
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
          })
        }
      ]
    },

    plugins: [
      new ExtractTextPlugin({
        filename: '[name].[contenthash:8].css'
      }),
      new ClosureCompilerPlugin({
        compiler: {
          language_in: 'ECMASCRIPT7',
          language_out: 'ECMASCRIPT5',
          compilation_level: 'ADVANCED'
        },
        concurrency: cpus().length
      }),
      new OptimizeCssAssetsPlugin({
        cssProcessorOptions: {
          discardComments: { removeAll: true }
        }
      })
    ]
  }
}
