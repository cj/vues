import ExtractTextPlugin from 'extract-text-webpack-plugin'

export default config => {
  return {
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
        filename: '[name].css'
      })
    ]
  }
}
