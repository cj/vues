import webpack           from 'webpack'
import PostCompilePlugin from 'post-compile-webpack-plugin'
import chalk             from 'chalk'
import stats             from './stats'

export default config => {
  return {
    output: {
      filename: '[name].js',
      sourceMapFilename: '[name].map'
    },

    plugins: [
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new PostCompilePlugin(stats)
    ]
  }
}
