import webpack           from 'webpack'
import PostCompilePlugin from 'post-compile-webpack-plugin'
import chalk             from 'chalk'

export default config => {
  return {
    output: {
      filename: '[name].js',
      sourceMapFilename: '[name].map',
      publicPath: '/'
    },

    entry: {
      client: ['webpack-hot-middleware/client?reload=true']
    },

    plugins: [
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new PostCompilePlugin(stats => {
        process.stdout.write('\x1Bc')

        if (stats.hasErrors() || stats.hasWarnings()) {
          console.log(stats.toString('errors-only')) // eslint-disable-line no-console
          console.log() // eslint-disable-line no-console
          console.log(chalk.bgRed.black(' ERROR '), 'Compiling failed!') // eslint-disable-line no-console
        } else {
          console.log(stats.toString({
            chunks: false,
            children: false,
            modules: false,
            colors: true
          })) // eslint-disable-line no-console
          console.log(chalk.bold(`\n> Open http://${config.host}:${config.port}\n`)) // eslint-disable-line no-console
          console.log(chalk.bgGreen.black(' DONE '), 'Compiled successfully!') // eslint-disable-line no-console
        }
        console.log() // eslint-disable-line no-console
      })
    ]
  }
}
