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

  return deepMerge({
    srcDir: projectDir(),
    vuesTmpDir: vuesTmpDir(),
    staticDir: 'static/',
    lang: 'en',
    head: {
      title: _.humanize(packageJson.name)
    },
    include: [vuesTmpDir()],
    envs: ['NODE_ENV'],
    nodeEnv: process.env.NODE_ENV,
    autoprefixer: {},
    minimize: process.env.NODE_ENV === 'production',
    babel: {
      presets: ['vue-app'],
      plugins: ['add-module-exports']
    }
  }, config)
}
