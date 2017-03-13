class VuePlugin {
  constructor (config) {
    this.config = config
  }

  apply (compiler) {
    compiler.plugin('done', stats => {
      if (this.config.spinner) {
        this.config.spinner.stop()
      }
    })
  }
}
export default config => {
  return new VuePlugin(config)
}
