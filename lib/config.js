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
    vuesTmpDir: vuesTmpDir(),
    staticDir: 'static',
    include: [vuesTmpDir()],
    envs: ['NODE_ENV'],
    nodeEnv: process.env.NODE_ENV,
    autoprefixer: {},
    minimize: process.env.NODE_ENV === 'production',
    router: {},
    polyfills: ['array/includes', 'string/includes'],
    vendor: [ 'vue', 'vue-router', 'promise-polyfill' ],
    babel: {
      presets: ['vue-app'],
      plugins: ['add-module-exports']
    }
  }, config)

  // istanbul ignore next
  if (!config.viewsDir) config.viewsDir = config.srcDir + '/views'

  // istanbul ignore if
  if (config.nodeEnv === 'development') {
    config.vendor.push('event-source-polyfill')
  }

  return config
}
