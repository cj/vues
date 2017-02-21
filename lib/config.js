import packageJson from '../package.json'
import {
  deepMerge,
  projectDir,
  fs,
  _
} from './utils'

const vuesConfig = projectDir('vues.config.js')

export default (config = {}) => {
  if (fs.existsSync(vuesConfig)) {
    config = deepMerge(config, require(vuesConfig))
  }

  return deepMerge({
    srcDir: projectDir(),
    lang: 'en',
    head: {
      title: _.humanize(packageJson.name)
    },
    envs: ['NODE_ENV'],
    nodeEnv: process.env.NODE_ENV
  }, config)
}
