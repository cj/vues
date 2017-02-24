import packageJson from '../package.json'
import {
  deepMerge,
  fs,
  _,
  projectDir,
  vuesTmpDir
} from './utils'

const vuesConfig = projectDir('vues.config.js')

export default (config = {}) => {
  if (fs.existsSync(vuesConfig)) {
    config = deepMerge(config, require(vuesConfig))
  }

  config = deepMerge({
    lang: 'en',
    title: _.humanize(packageJson.name),
    srcDir: projectDir(),
    vuesConfig: vuesConfig,
    vuesTmpDir: vuesTmpDir(),
    staticDir: 'static',
    include: [vuesTmpDir()],
    envs: ['NODE_ENV'],
    nodeEnv: process.env.NODE_ENV,
    autoprefixer: {},
    minimize: process.env.NODE_ENV === 'production',
    router: {},
    polyfills: ['promise', 'array/includes', 'string/includes'],
    vendor: [ 'vue', 'vue-router' ],
    babel: { presets: ['vue-app'] }
  }, config)

  // istanbul ignore next
  if (!config.viewsDir) config.viewsDir = config.srcDir + '/views'
  // istanbul ignore next
  if (!config.storeDir) config.storeDir = config.srcDir + '/store'

  // istanbul ignore if
  if (config.nodeEnv === 'development') {
    config.vendor.push('event-source-polyfill')
  }

  return config
}
