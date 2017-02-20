import { deepMerge, projectDir, existsSync } from './utils'

const vuesConfig = projectDir('vues.config.js')

export default (config = {}) => {
  if (existsSync(vuesConfig)) {
    config = deepMerge(config, require(vuesConfig))
  }

  return deepMerge({
    srcDir: projectDir(),
    envs: ['NODE_ENV'],
    nodeEnv: process.env.NODE_ENV
  }, config)
}
