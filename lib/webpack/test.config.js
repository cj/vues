export default (config) => {
  return {
    output: {
      filename: '[name].js',
      sourceMapFilename: '[name].map',
      publicPath: '/'
    }
  }
}
