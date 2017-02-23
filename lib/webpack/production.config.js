import ExtractTextPlugin from 'extract-text-webpack-plugin'

export default config => {
  return {
    devtool: 'source-map',

    output: {
      filename: '[name].[chunkhash:8].js',
      sourceMapFilename: '[name].[chunkhash:8].map',
      publicPath: '/'
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
        filename: '[name].[chunkhash:8].css'
      })
    ]
  }
}
