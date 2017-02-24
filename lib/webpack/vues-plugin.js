class VuePlugin {
  constructor (config) {
    this.config = config
  }

  apply (compiler) {
    compiler.plugin('done', stats => {
      this.config.spinner.stop()
    })
  }
}
export default config => {
  return new VuePlugin(config)
}
