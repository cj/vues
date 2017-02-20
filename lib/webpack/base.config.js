import HtmlWebpackPlugin from 'html-webpack-plugin'
import { projectDir, vuesDir, vuesTmpDir } from '../utils'

export default (config) => {
  return {
    performance: {
      hints: false
    },

    resolve: {
      extensions: ['.js', '.vue', '.html', '.css', '.json'],
      alias: {
        '~': config.srcDir
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
      client: [vuesTmpDir('client.js')]
    },

    plugins: [
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
