import { resolve }   from 'path'
import { deepMerge } from './utils'

export default (config) => {
  const projectDir = resolve('./')
  const vuesDir    = resolve(__dirname, '../')
  const srcDir     = projectDir

  return deepMerge({
    srcDir,
    vuesDir,
    projectDir,
    include: [srcDir],
    env: ['NODE_ENV']
  }, config)
}
