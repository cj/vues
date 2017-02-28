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
    titleTemplate: '{{ title }} | {{ viewTitle }}',
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
    store: {},
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'msapplication-tap-highlight', content: 'no' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'mobile-web-app-capable', content: 'yes' }
    ],
    polyfills: ['promise', 'array/includes', 'string/includes'],
    babel: { presets: ['vue-app'] },
    beforeMount: false,
    plugins: [],
    styles: [],
    scripts: [],
    vendor: [],
    filters: []
  }, config)

  const dirs = ['views', 'stores', 'filters', 'layouts']

  // istanbul ignore next
  dirs.forEach(dir => {
    let name = `${dir}Dir`

    if (!config[name]) config[name] = `${config.srcDir}/${dir}`
  })

  // istanbul ignore else
  if (config.titleTemplate) config.titleTemplate = config.titleTemplate.replace(/{{\s{0,2}title\s{0,2}}}/, config.title)

  return config
}
